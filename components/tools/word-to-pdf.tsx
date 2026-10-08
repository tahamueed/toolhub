"use client";

import { useState } from "react";
import { Download, FileOutput, RefreshCw } from "lucide-react";
import { FileDrop } from "@/components/file-drop";
import { Button } from "@/components/ui/button";
import { validateDocxFile } from "@/lib/pdf-utils";

export function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  async function handleFile(f: File) {
    const validationError = validateDocxFile(f);
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

    // html2canvas (used internally by jsPDF's html() method) needs the
    // content actually laid out in the document, so it's rendered into a
    // container positioned off-screen rather than hidden.
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.zIndex = "-9999";
    container.style.width = "800px";
    container.style.padding = "0";
    container.style.background = "#ffffff";
    container.style.color = "#111111";
    container.style.fontFamily = "Helvetica, Arial, sans-serif";
    container.style.fontSize = "13px";
    container.style.lineHeight = "1.5";

    try {
      const [mammoth, { default: jsPDF }] = await Promise.all([import("mammoth"), import("jspdf")]);
      await import("html2canvas");

      const buffer = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer });

      if (!html.trim()) {
        setError("No content could be found in that document.");
        setProcessing(false);
        return;
      }

      container.innerHTML = html;
      document.body.appendChild(container);

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 36;

      await new Promise<void>((resolve, reject) => {
        doc.html(container, {
          x: margin,
          y: margin,
          width: pageWidth - margin * 2,
          windowWidth: 800,
          callback: () => resolve(),
          html2canvas: { scale: 0.75, scrollX: 0, scrollY: 0 },
        });
        // jsPDF's html() has no reject path of its own, so this is a safety
        // net in case rendering hangs on an unusual document.
        setTimeout(() => reject(new Error("Conversion timed out")), 30000);
      });

      const baseName = file.name.replace(/\.docx$/i, "");
      doc.save(`${baseName}.pdf`);
      setDone(true);
    } catch {
      setError("Couldn't convert that document. Very complex layouts (tables, text boxes, embedded objects) sometimes don't convert cleanly.");
    } finally {
      container.remove();
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-5">
      {!file && (
        <FileDrop
          onFile={handleFile}
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          hint="A single .docx file, up to 25 MB"
        />
      )}

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
              {processing ? "Converting\u2026" : "Convert to PDF"}
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
              Your PDF has downloaded.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
