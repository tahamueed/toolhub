"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/utils";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name || "the ToolHub site"}`);
    const body = encodeURIComponent(`${message}\n\n\u2014\n${name} (${email})`);
    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-32 font-sans text-sm"
          required
        />
      </div>
      <Button type="submit" variant="primary">
        <Mail className="size-4" />
        Open in email app
      </Button>
      <p className="text-xs text-ink-muted">
        This opens a pre-filled message in your default email app addressed to{" "}
        <span className="font-mono text-ink">{siteConfig.contactEmail}</span>. Nothing is sent from
        this page directly.
      </p>
    </form>
  );
}
