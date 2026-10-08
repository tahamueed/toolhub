"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { FileDrop } from "@/components/file-drop";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { CopyButton } from "@/components/copy-button";
import { extractPdfTextByPage, validatePdfFile } from "@/lib/pdf-utils";
import { downloadBlob } from "@/lib/image-utils";

export function PdfToText() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  async function handleFile(f: File) {
    const validationError = validatePdfFile(f);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setText("");
    setFile(f);
    setProcessing(true);
    try {
      const pages = await extractPdfTextByPage(f);
      const joined = pages.join("\n\n");
      if (!joined.trim()) {
        setError(
          "No text could be found in that PDF. It may be a scanned image without a text layer, which requires OCR this tool doesn't perform."
        );
      }
      setText(joined);
    } catch {
      setError("Couldn't read that file \u2014 make sure it's a valid, unencrypted PDF.");
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
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink">{file.name}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFile(null);
                setText("");
                setError("");
              }}
            >
              <RefreshCw className="size-3.5" />
              Choose another file
            </Button>
          </div>

          <Textarea
            value={processing ? "Extracting text\u2026" : text}
            readOnly
            aria-label="Extracted text"
            className="min-h-64 font-sans text-sm"
          />

          <div className="flex flex-wrap gap-2">
            <CopyButton value={text} />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!text}
              onClick={() => downloadBlob(new Blob([text], { type: "text/plain" }), `${file.name.replace(/\.pdf$/i, "")}.txt`)}
            >
              <Download className="size-3.5" />
              Download .txt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
