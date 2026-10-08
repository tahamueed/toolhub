"use client";

import { useState } from "react";
import { Download, FileOutput, RefreshCw } from "lucide-react";
import { FileDrop } from "@/components/file-drop";
import { Button } from "@/components/ui/button";
import { validatePdfFile } from "@/lib/pdf-utils";
import { extractStructuredPdfContent, type StructuredParagraph } from "@/lib/pdf-structure";
import { downloadBlob } from "@/lib/image-utils";

const NUMBERING_REFERENCE = "pdf-to-word-numbered-list";

export function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  async function handleFile(f: File) {
    const validationError = validatePdfFile(f);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setDone(false);
    setFile(f);
  }

  async function handleConvert() {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      const pages = await extractStructuredPdfContent(file);
      const hasContent = pages.some((p) => p.paragraphs.length > 0);
      if (!hasContent) {
        setError(
          "No text could be found in that PDF. It may be a scanned image without a text layer, which this tool can't extract from."
        );
        setProcessing(false);
        return;
      }

      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } =
        await import("docx");

      const children: InstanceType<typeof Paragraph>[] = [];

      function toRuns(paragraph: StructuredParagraph) {
        return paragraph.runs
          .filter((r) => r.text.length > 0)
          .map((r) => new TextRun({ text: r.text, bold: r.bold || undefined, italics: r.italic || undefined }));
      }

      pages.forEach((page, pageIndex) => {
        page.paragraphs.forEach((paragraph) => {
          const alignment = paragraph.centered ? AlignmentType.CENTER : undefined;

          if (paragraph.type === "heading1") {
            children.push(
              new Paragraph({ heading: HeadingLevel.HEADING_1, alignment, children: toRuns(paragraph) })
            );
          } else if (paragraph.type === "heading2") {
            children.push(
              new Paragraph({ heading: HeadingLevel.HEADING_2, alignment, children: toRuns(paragraph) })
            );
          } else if (paragraph.type === "heading3") {
            children.push(
              new Paragraph({ heading: HeadingLevel.HEADING_3, alignment, children: toRuns(paragraph) })
            );
          } else if (paragraph.type === "bullet") {
            children.push(
              new Paragraph({ bullet: { level: paragraph.listLevel }, children: toRuns(paragraph) })
            );
          } else if (paragraph.type === "numbered") {
            children.push(
              new Paragraph({
                numbering: { reference: NUMBERING_REFERENCE, level: paragraph.listLevel },
                children: toRuns(paragraph),
              })
            );
          } else {
            children.push(new Paragraph({ alignment, children: toRuns(paragraph) }));
          }
        });

        if (pageIndex < pages.length - 1) {
          children.push(new Paragraph({ children: [new PageBreak()] }));
        }
      });

      // Match the generated document's page size to the source PDF's actual
      // dimensions (converted from points to twips: 1pt = 20 twips) rather
      // than assuming every PDF is Letter or A4.
      const firstPage = pages[0];
      const doc = new Document({
        numbering: {
          config: [
            {
              reference: NUMBERING_REFERENCE,
              levels: [0, 1, 2, 3].map((level) => ({
                level,
                format: "decimal" as const,
                text: "%" + (level + 1) + ".",
                alignment: AlignmentType.START,
              })),
            },
          ],
        },
        sections: [
          {
            properties: {
              page: {
                size: {
                  width: Math.round(firstPage.width * 20),
                  height: Math.round(firstPage.height * 20),
                },
              },
            },
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const baseName = file.name.replace(/\.pdf$/i, "");
      downloadBlob(blob, `${baseName}.docx`);
      setDone(true);
    } catch {
      setError("Couldn't convert that file \u2014 make sure it's a valid, unencrypted PDF.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-5">
      {!file && <FileDrop onFile={handleFile} accept="application/pdf" hint="A single PDF file, up to 50 MB" />}

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      {file && (
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-panel-raised p-4">
            <p className="text-sm text-ink">{file.name}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleConvert} disabled={processing}>
              <FileOutput className="size-4" />
              {processing ? "Analyzing layout\u2026" : "Convert to Word"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFile(null);
                setError("");
                setDone(false);
              }}
            >
              <RefreshCw className="size-4" />
              Choose another file
            </Button>
          </div>

          {done && (
            <p className="flex items-center gap-1.5 text-sm text-teal">
              <Download className="size-3.5" />
              Your .docx file has downloaded, with headings, bold/italic text, and lists preserved.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
