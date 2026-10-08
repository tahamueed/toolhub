"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { FileDrop } from "@/components/file-drop";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/field";
import {
  canvasToBlob,
  downloadBlob,
  formatBytes,
  loadImageFromFile,
  validateImageFile,
} from "@/lib/image-utils";

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [quality, setQuality] = useState(0.7);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);

  async function handleFile(f: File) {
    const validationError = validateImageFile(f);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
    await compress(f, quality);
  }

  async function compress(f: File, q: number) {
    setProcessing(true);
    try {
      const img = await loadImageFromFile(f);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas isn't supported in this browser.");
      ctx.drawImage(img, 0, 0);
      const outType = f.type === "image/png" ? "image/png" : "image/jpeg";
      const blob = await canvasToBlob(canvas, outType, outType === "image/jpeg" ? q : undefined);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProcessing(false);
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

      {file && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-ink-muted">Original</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Original preview" className="max-h-64 w-full rounded-md border border-border object-contain bg-panel-raised" />
              <p className="mt-1 text-xs text-ink-muted">{formatBytes(file.size)}</p>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-ink-muted">Compressed</p>
              {result ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.url} alt="Compressed preview" className="max-h-64 w-full rounded-md border border-border object-contain bg-panel-raised" />
                  <p className="mt-1 text-xs text-ink-muted">
                    {formatBytes(result.blob.size)}{" "}
                    {result.blob.size < file.size &&
                      `(\u2212${Math.round((1 - result.blob.size / file.size) * 100)}%)`}
                  </p>
                </>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border text-sm text-ink-muted">
                  {processing ? "Compressing\u2026" : "\u2014"}
                </div>
              )}
            </div>
          </div>

          {file.type !== "image/png" && (
            <div>
              <Label htmlFor="quality">Quality ({Math.round(quality * 100)}%)</Label>
              <input
                id="quality"
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => {
                  const q = Number(e.target.value);
                  setQuality(q);
                  if (file) compress(file, q);
                }}
                className="w-full accent-accent"
              />
            </div>
          )}
          {file.type === "image/png" && (
            <p className="text-xs text-ink-muted">
              PNG is lossless, so quality can&rsquo;t be adjusted \u2014 re-encoding still often reduces file size.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => result && downloadBlob(result.blob, `compressed-${file.name}`)}
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
