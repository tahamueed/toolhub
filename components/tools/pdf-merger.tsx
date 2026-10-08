"use client";

import { useState } from "react";
import { Download, Layers, RefreshCw } from "lucide-react";
import { MultiFileDrop, OrderedFileList } from "@/components/ordered-file-list";
import { Button } from "@/components/ui/button";
import { validatePdfFile } from "@/lib/pdf-utils";

export function PdfMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState("");

  function addFiles(newFiles: File[]) {
    for (const f of newFiles) {
      const validationError = validatePdfFile(f);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    setError("");
    setResultUrl("");
    setFiles((prev) => [...prev, ...newFiles]);
  }

  function reorder(from: number, to: number) {
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setResultUrl("");
  }

  function remove(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResultUrl("");
  }

  async function handleMerge() {
    if (files.length < 2) {
      setError("Add at least two PDF files to merge.");
      return;
    }
    setError("");
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const copiedPages = await merged.copyPages(src, src.getPageIndices());
        copiedPages.forEach((page) => merged.addPage(page));
      }
      const mergedBytes = await merged.save();
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't merge those files \u2014 make sure each one is a valid, unencrypted PDF.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-5">
      <MultiFileDrop onFiles={addFiles} accept="application/pdf" hint="Two or more PDF files" />

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <>
          <OrderedFileList files={files} onReorder={reorder} onRemove={remove} />

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleMerge} disabled={files.length < 2 || processing}>
              <Layers className="size-4" />
              {processing ? "Merging\u2026" : "Merge PDFs"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFiles([]);
                setResultUrl("");
                setError("");
              }}
            >
              <RefreshCw className="size-4" />
              Start over
            </Button>
          </div>

          {resultUrl && (
            <div className="rounded-md border border-border bg-panel-raised p-4">
              <p className="text-sm text-ink">Your merged PDF is ready.</p>
              <a
                href={resultUrl}
                download="merged.pdf"
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
              >
                <Download className="size-4" />
                Download merged.pdf
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
