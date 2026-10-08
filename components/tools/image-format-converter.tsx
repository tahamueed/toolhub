"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { FileDrop } from "@/components/file-drop";
import { Button } from "@/components/ui/button";
import { canvasToBlob, downloadBlob, loadImageFromFile, validateImageFile } from "@/lib/image-utils";

type Format = "image/jpeg" | "image/png" | "image/webp";
const formats: { key: Format; label: string; ext: string }[] = [
  { key: "image/jpeg", label: "JPG", ext: "jpg" },
  { key: "image/png", label: "PNG", ext: "png" },
  { key: "image/webp", label: "WebP", ext: "webp" },
];

export function ImageFormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [target, setTarget] = useState<Format>("image/png");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);

  async function handleFile(f: File) {
    const validationError = validateImageFile(f);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setResult(null);
    setFile(f);
    setImage(await loadImageFromFile(f));
  }

  async function convert(format: Format) {
    if (!image) return;
    setTarget(format);
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Canvas isn't supported in this browser.");
      return;
    }
    if (format === "image/jpeg") {
      // JPEG has no alpha channel; flatten onto white first.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(image, 0, 0);
    try {
      const blob = await canvasToBlob(canvas, format, format === "image/jpeg" ? 0.92 : undefined);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="space-y-5">
      {!file && <FileDrop onFile={handleFile} accept="image/*" hint="JPG, PNG, or WebP \u2014 up to 25 MB" />}
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      {file && image && (
        <div className="space-y-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt="Preview" className="max-h-64 w-full rounded-md border border-border object-contain bg-panel-raised" />

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">Convert to</p>
            <div className="flex flex-wrap gap-2">
              {formats.map((f) => (
                <Button key={f.key} type="button" size="sm" variant={target === f.key ? "primary" : "secondary"} onClick={() => convert(f.key)}>
                  {f.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => {
                if (!result || !file) return;
                const ext = formats.find((f) => f.key === target)?.ext ?? "img";
                const baseName = file.name.replace(/\.[^.]+$/, "");
                downloadBlob(result.blob, `${baseName}.${ext}`);
              }}
              disabled={!result}
            >
              <Download className="size-4" />
              Download
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFile(null);
                setImage(null);
                setResult(null);
                setError("");
              }}
            >
              <RefreshCw className="size-4" />
              Choose another image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
