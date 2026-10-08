import { loadPdfDocument } from "@/lib/pdf-utils";

export type ParagraphType =
  | "heading1"
  | "heading2"
  | "heading3"
  | "body"
  | "bullet"
  | "numbered";

export interface TextRunInfo {
  text: string;
  bold: boolean;
  italic: boolean;
}

export interface StructuredParagraph {
  type: ParagraphType;
  runs: TextRunInfo[];
  centered: boolean;
  /** Nesting level for list items, 0-based. */
  listLevel: number;
}

export interface StructuredPage {
  /** Page dimensions in points, as reported by the PDF itself. */
  width: number;
  height: number;
  paragraphs: StructuredParagraph[];
}

interface RawItem {
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  bold: boolean;
  italic: boolean;
}

interface Line {
  y: number;
  items: RawItem[];
}

const BULLET_RE = /^[\u2022\u25CF\u25CB\u25AA\u25E6\u2043\u2219\-\*]\s+/;
const NUMBERED_RE = /^(\d+|[a-zA-Z]|[ivxlcdmIVXLCDM]+)[.)]\s+/;

function mode(values: number[]): number {
  const buckets = new Map<number, number>();
  for (const v of values) {
    const key = Math.round(v * 2) / 2; // bucket to nearest 0.5pt
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }
  let best = 11;
  let bestCount = 0;
  for (const [key, count] of buckets) {
    if (count > bestCount) {
      best = key;
      bestCount = count;
    }
  }
  return best;
}

function lineText(line: Line): string {
  let text = "";
  for (let i = 0; i < line.items.length; i++) {
    const item = line.items[i];
    const prev = line.items[i - 1];
    if (prev) {
      const gap = item.x - (prev.x + prev.width);
      const needsSpace = gap > prev.fontSize * 0.15;
      const prevEndsWithSpace = /\s$/.test(prev.text);
      if (needsSpace && !prevEndsWithSpace) text += " ";
    }
    text += item.text;
  }
  return text.replace(/\s+/g, " ").trim();
}

function buildRuns(line: Line): TextRunInfo[] {
  const runs: TextRunInfo[] = [];
  for (let i = 0; i < line.items.length; i++) {
    const item = line.items[i];
    const prev = line.items[i - 1];
    let text = item.text;
    if (prev) {
      const gap = item.x - (prev.x + prev.width);
      const needsSpace = gap > prev.fontSize * 0.15;
      const prevEndsWithSpace = /\s$/.test(prev.text);
      if (needsSpace && !prevEndsWithSpace) text = " " + text;
    }
    const last = runs[runs.length - 1];
    if (last && last.bold === item.bold && last.italic === item.italic) {
      last.text += text;
    } else {
      runs.push({ text, bold: item.bold, italic: item.italic });
    }
  }
  return runs;
}

async function extractPageStructure(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof loadPdfDocument>>["getPage"]>>
): Promise<{ width: number; height: number; lines: Line[] }> {
  // Resolves font objects (bold/italic flags) into page.commonObjs before
  // getTextContent() is called, since font metadata isn't available until
  // the content stream has been walked at least once.
  await page.getOperatorList();
  const viewport = page.getViewport({ scale: 1 });
  const content = await page.getTextContent();

  const items: RawItem[] = [];
  for (const raw of content.items) {
    if (!("str" in raw) || !raw.str) continue;
    let bold = false;
    let italic = false;
    try {
      const fontObj = page.commonObjs.get(raw.fontName) as
        | { bold?: boolean; italic?: boolean }
        | undefined;
      bold = !!fontObj?.bold;
      italic = !!fontObj?.italic;
    } catch {
      // Font object not resolved; fall back to non-bold/italic.
    }
    items.push({
      text: raw.str,
      x: raw.transform[4],
      y: raw.transform[5],
      width: raw.width,
      fontSize: Math.hypot(raw.transform[2], raw.transform[3]) || 1,
      bold,
      italic,
    });
  }

  items.sort((a, b) => b.y - a.y || a.x - b.x);

  const Y_TOL = 2.5;
  const lines: Line[] = [];
  for (const item of items) {
    const current = lines[lines.length - 1];
    if (current && Math.abs(current.y - item.y) <= Y_TOL) {
      current.items.push(item);
    } else {
      lines.push({ y: item.y, items: [item] });
    }
  }
  for (const line of lines) line.items.sort((a, b) => a.x - b.x);

  return { width: viewport.width, height: viewport.height, lines };
}

function classifyLine(
  line: Line,
  bodySize: number
): { type: ParagraphType; text: string; indent: number } {
  const text = lineText(line);
  const maxSize = Math.max(...line.items.map((i) => i.fontSize));
  const boldChars = line.items.filter((i) => i.bold).reduce((s, i) => s + i.text.length, 0);
  const totalChars = line.items.reduce((s, i) => s + i.text.length, 0) || 1;
  const boldFraction = boldChars / totalChars;
  const ratio = maxSize / bodySize;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const indent = line.items[0]?.x ?? 0;

  if (BULLET_RE.test(text)) {
    return { type: "bullet", text: text.replace(BULLET_RE, ""), indent };
  }
  if (NUMBERED_RE.test(text) && wordCount > 1) {
    return { type: "numbered", text: text.replace(NUMBERED_RE, ""), indent };
  }
  if (ratio >= 1.4) return { type: "heading1", text, indent };
  if (ratio >= 1.15) return { type: "heading2", text, indent };
  if (boldFraction >= 0.6 && wordCount <= 10 && wordCount > 0) {
    return { type: "heading3", text, indent };
  }
  return { type: "body", text, indent };
}

/** Reconstructs each page's real paragraph/heading/list structure instead of
 * treating the page as one undifferentiated block of text. */
export async function extractStructuredPdfContent(file: File): Promise<StructuredPage[]> {
  const doc = await loadPdfDocument(file);

  const pagesRaw: { width: number; height: number; lines: Line[] }[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    pagesRaw.push(await extractPageStructure(page));
  }

  const allLineSizes = pagesRaw.flatMap((p) =>
    p.lines.map((l) => Math.max(...l.items.map((i) => i.fontSize)))
  );
  const bodySize = allLineSizes.length ? mode(allLineSizes) : 11;

  const pages: StructuredPage[] = [];
  for (const { width, height, lines } of pagesRaw) {
    // Typical single-spaced line gap, used to detect paragraph breaks.
    const bodyGaps: number[] = [];
    for (let i = 1; i < lines.length; i++) {
      const gap = lines[i - 1].y - lines[i].y;
      if (gap > 0 && gap < bodySize * 2.5) bodyGaps.push(gap);
    }
    const normalGap = bodyGaps.length ? mode(bodyGaps) : bodySize * 1.3;

    const paragraphs: StructuredParagraph[] = [];
    let bufferLines: Line[] = [];
    let bufferRuns: TextRunInfo[] = [];
    let prevY: number | null = null;
    // Baseline x-position for the current run of consecutive list items,
    // so nesting level is relative to where *this* list actually starts
    // (e.g. a standard 72pt margin) rather than an absolute page offset.
    let listBaseIndent: number | null = null;

    function flush() {
      if (bufferLines.length === 0) return;
      const centered = isCentered(bufferLines, width);
      paragraphs.push({ type: "body", runs: bufferRuns, centered, listLevel: 0 });
      bufferLines = [];
      bufferRuns = [];
    }

    for (const line of lines) {
      const { type, text, indent } = classifyLine(line, bodySize);
      if (!text.trim()) continue;

      const gap = prevY !== null ? prevY - line.y : null;
      const isParagraphBreak = gap !== null && normalGap > 0 && gap > normalGap * 1.7;
      const isStandalone = type !== "body";
      const isListItem = type === "bullet" || type === "numbered";

      if (isStandalone || isParagraphBreak) flush();
      if (!isListItem) listBaseIndent = null;

      if (isStandalone) {
        const runs = buildRuns(line);
        let listLevel = 0;
        if (isListItem) {
          if (listBaseIndent === null) listBaseIndent = indent;
          listLevel = Math.max(0, Math.min(3, Math.round((indent - listBaseIndent) / 20)));
          // Strip the detected bullet/number prefix from the first run's text.
          const prefixLen = line.items.length ? lineText(line).length - text.length : 0;
          if (runs[0]) runs[0] = { ...runs[0], text: runs[0].text.slice(prefixLen).replace(/^\s+/, "") };
        }
        paragraphs.push({ type, runs, centered: isCentered([line], width), listLevel });
        prevY = line.y;
        continue;
      }

      const lineRuns = buildRuns(line);
      if (bufferRuns.length > 0) {
        // Join wrapped lines within the same paragraph with a space.
        const lastBuffered = bufferRuns[bufferRuns.length - 1];
        const firstNew = lineRuns[0];
        if (firstNew && lastBuffered.bold === firstNew.bold && lastBuffered.italic === firstNew.italic) {
          lastBuffered.text += " " + firstNew.text;
          bufferRuns.push(...lineRuns.slice(1));
        } else if (firstNew) {
          bufferRuns.push({ ...firstNew, text: " " + firstNew.text }, ...lineRuns.slice(1));
        }
      } else {
        bufferRuns.push(...lineRuns);
      }
      bufferLines.push(line);
      prevY = line.y;
    }
    flush();

    pages.push({ width, height, paragraphs });
  }

  return pages;
}

function isCentered(lines: Line[], pageWidth: number): boolean {
  if (lines.length === 0) return false;
  const pageCenter = pageWidth / 2;
  return lines.every((line) => {
    const first = line.items[0];
    const last = line.items[line.items.length - 1];
    if (!first || !last) return false;
    const lineStart = first.x;
    const lineEnd = last.x + last.width;
    const lineCenter = (lineStart + lineEnd) / 2;
    const lineWidth = lineEnd - lineStart;
    // Only trust centering for lines that don't span most of the page
    // (a full-width paragraph line will coincidentally look "centered").
    return Math.abs(lineCenter - pageCenter) < 18 && lineWidth < pageWidth * 0.85;
  });
}
