"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { Textarea, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type PageSize = "a4" | "letter";

export function TextToPdf() {
  const [text, setText] = useState("");
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [fontSize, setFontSize] = useState(12);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!text.trim()) {
      setError("Add some text first.");
      return;
    }
    setError("");
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: pageSize });
      const margin = 48;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const usableWidth = pageWidth - margin * 2;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);

      const lineHeight = fontSize * 1.4;
      const lines = doc.splitTextToSize(text, usableWidth) as string[];

      let y = margin;
      for (const line of lines) {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      }

      doc.save(`${title.trim() || "document"}.pdf`);
    } catch {
      setError("Couldn't generate the PDF. Try again.");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="doc-title">Title (used as the filename)</Label>
        <input
          id="doc-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My notes"
          className="w-full max-w-sm rounded-md border border-border bg-panel px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <Label htmlFor="doc-text">Text</Label>
        <Textarea
          id="doc-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your notes here\u2026"
          className="min-h-64 font-sans text-sm"
        />
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <Label htmlFor="page-size">Page size</Label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSize)}
            className="h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink focus:border-accent focus:outline-none"
          >
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
          </select>
        </div>
        <div>
          <Label htmlFor="font-size">Font size</Label>
          <select
            id="font-size"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink focus:border-accent focus:outline-none"
          >
            {[10, 11, 12, 14, 16].map((s) => (
              <option key={s} value={s}>
                {s}pt
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="button" onClick={handleGenerate}>
        <FileDown className="size-4" />
        Generate PDF
      </Button>
    </div>
  );
}
