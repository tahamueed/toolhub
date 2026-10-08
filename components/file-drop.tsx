"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileDrop({
  onFile,
  accept = "image/*",
  hint = "PNG, JPG, or WebP",
}: {
  onFile: (file: File) => void;
  accept?: string;
  hint?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (files && files[0]) onFile(files[0]);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border px-6 py-12 text-center transition-colors cursor-pointer",
        dragging ? "border-accent bg-panel-raised" : "hover:border-border-strong"
      )}
    >
      <UploadCloud className="size-8 text-ink-muted" aria-hidden />
      <p className="text-sm font-medium text-ink">Drop a file here, or click to choose</p>
      <p className="text-xs text-ink-muted">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
