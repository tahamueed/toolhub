"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";

type Mode = "encode" | "decode";

export function UrlEncoderTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: "" };
    try {
      return {
        output: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input),
        error: "",
      };
    } catch {
      return { output: "", error: "That input isn't validly percent-encoded." };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-md border border-border p-0.5">
          <Button type="button" size="sm" variant={mode === "encode" ? "primary" : "ghost"} onClick={() => setMode("encode")}>
            Encode
          </Button>
          <Button type="button" size="sm" variant={mode === "decode" ? "primary" : "ghost"} onClick={() => setMode("decode")}>
            Decode
          </Button>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => setInput("")} className="ml-auto">
          Clear
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "https://example.com/search?q=hello world" : "https%3A%2F%2Fexample.com"}
            aria-label="Input"
            className="min-h-40"
          />
          {error && (
            <p role="alert" className="mt-2 text-xs text-danger">
              {error}
            </p>
          )}
        </div>
        <div>
          <Textarea value={output} readOnly placeholder="Result appears here" aria-label="Output" className="min-h-40 bg-panel-raised" />
          <div className="mt-2 flex justify-end">
            <CopyButton value={output} />
          </div>
        </div>
      </div>
    </div>
  );
}
