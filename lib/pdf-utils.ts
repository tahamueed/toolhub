import type { PDFDocumentProxy } from "pdfjs-dist";

let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;

/** Lazily loads pdf.js and points its worker at a bundled asset, so the
 * (fairly large) library is only ever fetched when a PDF tool is actually
 * used. */
async function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

export async function loadPdfDocument(file: File): Promise<PDFDocumentProxy> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({
    data: buffer,
    // Static font data for PDFs that reference a standard font (e.g. Helvetica)
    // without embedding it. Copied into /public at build time from pdfjs-dist.
    standardFontDataUrl: "/pdfjs/standard_fonts/",
  });
  return loadingTask.promise;
}

/** Extracts text from every page, returned as an array (one string per page). */
export async function extractPdfTextByPage(file: File): Promise<string[]> {
  const doc = await loadPdfDocument(file);
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    pages.push(text);
  }
  return pages;
}

export function validatePdfFile(file: File): string | null {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "That file isn't a PDF.";
  }
  if (file.size > 50 * 1024 * 1024) {
    return "That PDF is larger than 50 MB \u2014 try a smaller file.";
  }
  return null;
}

export function validateDocxFile(file: File): string | null {
  const isDocx =
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx");
  if (!isDocx) return "That file isn't a .docx Word document.";
  if (file.size > 25 * 1024 * 1024) return "That document is larger than 25 MB \u2014 try a smaller file.";
  return null;
}
