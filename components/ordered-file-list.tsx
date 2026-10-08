"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/image-utils";

export function MultiFileDrop({
  onFiles,
  accept,
  hint,
}: {
  onFiles: (files: File[]) => void;
  accept: string;
  hint: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(list: FileList | null) {
    if (list && list.length) onFiles(Array.from(list));
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
        "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border px-6 py-10 text-center transition-colors cursor-pointer",
        dragging ? "border-accent bg-panel-raised" : "hover:border-border-strong"
      )}
    >
      <UploadCloud className="size-7 text-ink-muted" aria-hidden />
      <p className="text-sm font-medium text-ink">Drop files here, or click to add</p>
      <p className="text-xs text-ink-muted">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function OrderedFileList({
  files,
  onReorder,
  onRemove,
}: {
  files: File[];
  onReorder: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <ul className="space-y-2">
      {files.map((file, i) => (
        <li
          key={`${file.name}-${file.lastModified}-${i}`}
          className="flex items-center gap-3 rounded-md border border-border bg-panel-raised px-3 py-2.5"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-panel font-mono text-xs text-ink-muted">
            {i + 1}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-ink">{file.name}</span>
          <span className="shrink-0 text-xs text-ink-muted">{formatBytes(file.size)}</span>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={`Move ${file.name} up`}
              disabled={i === 0}
              onClick={() => onReorder(i, i - 1)}
              className="px-1.5"
            >
              <ArrowUp className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={`Move ${file.name} down`}
              disabled={i === files.length - 1}
              onClick={() => onReorder(i, i + 1)}
              className="px-1.5"
            >
              <ArrowDown className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={`Remove ${file.name}`}
              onClick={() => onRemove(i)}
              className="px-1.5 text-danger hover:text-danger"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
