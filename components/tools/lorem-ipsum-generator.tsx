"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { Textarea } from "@/components/ui/field";
import { CopyButton } from "@/components/copy-button";

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " "
  );

type Unit = "paragraphs" | "sentences" | "words";

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function makeSentence() {
  const len = 6 + Math.floor(Math.random() * 10);
  const words = Array.from({ length: len }, randomWord);
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function makeParagraph() {
  const sentences = 3 + Math.floor(Math.random() * 4);
  return Array.from({ length: sentences }, makeSentence).join(" ");
}

export function LoremIpsumGenerator() {
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");

  function generate() {
    if (unit === "words") {
      const words = Array.from({ length: count }, randomWord);
      words[0] = words[0][0].toUpperCase() + words[0].slice(1);
      setOutput(words.join(" ") + ".");
    } else if (unit === "sentences") {
      setOutput(Array.from({ length: count }, makeSentence).join(" "));
    } else {
      setOutput(Array.from({ length: count }, makeParagraph).join("\n\n"));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="unit">Generate</Label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="h-10 rounded-md border border-border bg-panel px-3 text-sm text-ink focus:border-accent focus:outline-none"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div>
          <Label htmlFor="count">Count</Label>
          <Input
            id="count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="w-24"
          />
        </div>
        <Button type="button" onClick={generate}>
          Generate
        </Button>
      </div>

      <div>
        <Textarea value={output} readOnly aria-label="Generated placeholder text" placeholder="Generated text appears here" className="min-h-56 font-sans text-sm" />
        <div className="mt-2 flex justify-end">
          <CopyButton value={output} />
        </div>
      </div>
    </div>
  );
}
