"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { FileDrop } from "@/components/file-drop";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { CopyButton } from "@/components/copy-button";
import { downloadBlob, validateImageFile } from "@/lib/image-utils";

type Mode = "toBase64" | "fromBase64";

export function Base64ImageConverter() {
  const [mode, setMode] = useState<Mode>("toBase64");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const [pastedInput, setPastedInput] = useState("");

  function handleFile(file: File) {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => setDataUrl(reader.result as string);
    reader.onerror = () => setError("Couldn't read that file.");
    reader.readAsDataURL(file);
  }

  function handleDecode(value: string) {
    setPastedInput(value);
    if (!value.trim()) {
      setError("");
      setDataUrl("");
      return;
    }
    if (!/^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value.trim())) {
      setError("That doesn't look like an image data URL (should start with \"data:image/...;base64,\").");
      setDataUrl("");
      return;
    }
    setError("");
    setDataUrl(value.trim());
  }

  function downloadDecoded() {
    if (!dataUrl) return;
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
    if (!match) return;
    const [, mime, base64] = match;
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const ext = mime.split("/")[1] || "png";
    downloadBlob(new Blob([bytes], { type: mime }), `decoded-image.${ext}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex rounded-md border border-border p-0.5 w-fit">
        <Button
          type="button"
          size="sm"
          variant={mode === "toBase64" ? "primary" : "ghost"}
          onClick={() => {
            setMode("toBase64");
            setDataUrl("");
            setError("");
          }}
        >
          Image \u2192 Base64
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "fromBase64" ? "primary" : "ghost"}
          onClick={() => {
            setMode("fromBase64");
            setDataUrl("");
            setError("");
          }}
        >
          Base64 \u2192 Image
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      {mode === "toBase64" ? (
        <div className="space-y-4">
          {!dataUrl && <FileDrop onFile={handleFile} accept="image/*" hint="JPG, PNG, or WebP \u2014 up to 25 MB" />}
          {dataUrl && (
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUrl} alt="Preview" className="max-h-48 rounded-md border border-border object-contain bg-panel-raised" />
              <Textarea value={dataUrl} readOnly className="min-h-32" aria-label="Base64 data URL" />
              <div className="flex flex-wrap gap-2">
                <CopyButton value={dataUrl} label="Copy data URL" />
                <Button type="button" variant="outline" size="sm" onClick={() => setDataUrl("")}>
                  <RefreshCw className="size-3.5" />
                  Choose another image
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Textarea
            value={pastedInput}
            onChange={(e) => handleDecode(e.target.value)}
            placeholder="data:image/png;base64,iVBORw0KGgo\u2026"
            aria-label="Base64 data URL input"
            className="min-h-32 font-mono text-xs"
          />
          {dataUrl && !error && (
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUrl} alt="Decoded preview" className="max-h-48 rounded-md border border-border object-contain bg-panel-raised" />
              <Button type="button" onClick={downloadDecoded}>
                <Download className="size-4" />
                Download image
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
