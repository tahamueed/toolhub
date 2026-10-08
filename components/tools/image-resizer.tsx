"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { FileDrop } from "@/components/file-drop";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { canvasToBlob, downloadBlob, loadImageFromFile, validateImageFile } from "@/lib/image-utils";

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
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
    const img = await loadImageFromFile(f);
    setImage(img);
    setWidth(img.naturalWidth);
    setHeight(img.naturalHeight);
  }

  function onWidthChange(w: number) {
    setWidth(w);
    if (lockRatio && image) {
      setHeight(Math.round((w * image.naturalHeight) / image.naturalWidth));
    }
  }

  function onHeightChange(h: number) {
    setHeight(h);
    if (lockRatio && image) {
      setWidth(Math.round((h * image.naturalWidth) / image.naturalHeight));
    }
  }

  async function handleResize() {
    if (!image || !file || width <= 0 || height <= 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Canvas isn't supported in this browser.");
      return;
    }
    ctx.drawImage(image, 0, 0, width, height);
    const type = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await canvasToBlob(canvas, type, 0.92);
    setResult({ blob, url: URL.createObjectURL(blob) });
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-ink-muted">Original</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt="Original preview" className="max-h-64 w-full rounded-md border border-border object-contain bg-panel-raised" />
              <p className="mt-1 text-xs text-ink-muted">
                {image.naturalWidth} &times; {image.naturalHeight}px
              </p>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-ink-muted">Resized</p>
              {result ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.url} alt="Resized preview" className="max-h-64 w-full rounded-md border border-border object-contain bg-panel-raised" />
              ) : (
                <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border text-sm text-ink-muted">
                  Set dimensions and resize
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <Label htmlFor="width">Width (px)</Label>
              <Input id="width" type="number" value={width} onChange={(e) => onWidthChange(Number(e.target.value))} className="w-28" />
            </div>
            <div>
              <Label htmlFor="height">Height (px)</Label>
              <Input id="height" type="number" value={height} onChange={(e) => onHeightChange(Number(e.target.value))} className="w-28" />
            </div>
            <label className="flex items-center gap-1.5 pb-2.5 text-xs text-ink-muted">
              <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} className="accent-accent" />
              Lock aspect ratio
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleResize}>
              Resize
            </Button>
            <Button type="button" onClick={() => result && downloadBlob(result.blob, `resized-${file.name}`)} disabled={!result} variant="secondary">
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
