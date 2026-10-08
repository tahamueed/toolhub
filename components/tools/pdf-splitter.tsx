"use client";

import { useState } from "react";
import { Download, RefreshCw, Scissors } from "lucide-react";
import { FileDrop } from "@/components/file-drop";
import { Button } from "@/components/ui/button";
import { validatePdfFile } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/image-utils";

export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  async function handleFile(f: File) {
    const validationError = validatePdfFile(f);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setFile(f);
    setPageCount(0);
  }

  async function handleSplit() {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      const [{ PDFDocument }, JSZipModule] = await Promise.all([import("pdf-lib"), import("jszip")]);
      const JSZip = JSZipModule.default;

      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const total = src.getPageCount();
      setPageCount(total);

      if (total < 2) {
        setError("That PDF only has one page \u2014 there's nothing to split.");
        setProcessing(false);
        return;
      }

      const zip = new JSZip();
      const baseName = file.name.replace(/\.pdf$/i, "");
      const digits = String(total).length;

      for (let i = 0; i < total; i++) {
        const doc = await PDFDocument.create();
        const [page] = await doc.copyPages(src, [i]);
        doc.addPage(page);
        const pageBytes = await doc.save();
        const label = String(i + 1).padStart(digits, "0");
        zip.file(`${baseName}-page-${label}.pdf`, pageBytes);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `${baseName}-split.zip`);
    } catch {
      setError("Couldn't split that file \u2014 make sure it's a valid, unencrypted PDF.");
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
            {pageCount > 0 && (
              <p className="mt-1 text-xs text-ink-muted">{pageCount} pages will be split into separate files.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleSplit} disabled={processing}>
              <Scissors className="size-4" />
              {processing ? "Splitting\u2026" : "Split PDF"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFile(null);
                setError("");
                setPageCount(0);
              }}
            >
              <RefreshCw className="size-4" />
              Choose another file
            </Button>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Download className="size-3.5" />
            The split pages download automatically as a ZIP file once processing finishes.
          </p>
        </div>
      )}
    </div>
  );
}
