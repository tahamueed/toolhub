"use client";

import { useState } from "react";
import { FileDown, RefreshCw } from "lucide-react";
import { MultiFileDrop, OrderedFileList } from "@/components/ordered-file-list";
import { Button } from "@/components/ui/button";
import { validateImageFile, loadImageFromFile } from "@/lib/image-utils";

export function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  function addFiles(newFiles: File[]) {
    for (const f of newFiles) {
      const validationError = validateImageFile(f);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    setError("");
    setFiles((prev) => [...prev, ...newFiles]);
  }

  function reorder(from: number, to: number) {
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function remove(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCreate() {
    if (files.length === 0) return;
    setProcessing(true);
    setError("");
    try {
      const { default: jsPDF } = await import("jspdf");
      let doc: InstanceType<typeof jsPDF> | null = null;

      for (const file of files) {
        const img = await loadImageFromFile(file);
        const isLandscape = img.naturalWidth >= img.naturalHeight;
        const pageDoc = new jsPDF({
          orientation: isLandscape ? "landscape" : "portrait",
          unit: "pt",
          format: "a4",
        });

        if (!doc) {
          doc = pageDoc;
        } else {
          doc.addPage("a4", isLandscape ? "landscape" : "portrait");
        }

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 24;
        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;
        const scale = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight);
        const drawWidth = img.naturalWidth * scale;
        const drawHeight = img.naturalHeight * scale;
        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;

        const format = file.type === "image/png" ? "PNG" : "JPEG";
        doc.addImage(img, format, x, y, drawWidth, drawHeight, undefined, "FAST");
      }

      doc?.save("images.pdf");
    } catch {
      setError("Couldn't build the PDF from those images. Try a different set of files.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-5">
      <MultiFileDrop onFiles={addFiles} accept="image/*" hint="One or more images (JPG, PNG, or WebP)" />

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <>
          <OrderedFileList files={files} onReorder={reorder} onRemove={remove} />

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleCreate} disabled={processing}>
              <FileDown className="size-4" />
              {processing ? "Creating PDF\u2026" : "Create PDF"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFiles([]);
                setError("");
              }}
            >
              <RefreshCw className="size-4" />
              Start over
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
