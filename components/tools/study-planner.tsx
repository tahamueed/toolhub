"use client";

import { useEffect, useState } from "react";
import { Check, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  subject: string;
  topic: string;
  date: string;
  startTime: string;
  endTime: string;
  priority: "low" | "medium" | "high";
  notes: string;
  completed: boolean;
}

const STORAGE_KEY = "toolhub:study-planner:v1";

const priorityStyles: Record<Session["priority"], string> = {
  high: "text-danger border-danger/40",
  medium: "text-accent border-accent/40",
  low: "text-ink-muted border-border-strong",
};

function emptyDraft(): Omit<Session, "id" | "completed"> {
  return {
    subject: "",
    topic: "",
    date: new Date().toISOString().slice(0, 10),
    startTime: "09:00",
    endTime: "10:00",
    priority: "medium",
    notes: "",
  };
}

export function StudyPlanner() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft());

  // Load from localStorage only after mount, to avoid a server/client
  // hydration mismatch (the server has no access to the browser's storage).
  // This one-time load-from-storage-after-mount is the same necessary
  // pattern as the theme toggle's hydration guard elsewhere in this app.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setSessions(JSON.parse(raw));
    } catch {
      // Corrupt or inaccessible storage; start with an empty plan.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Storage full or unavailable; changes just won't persist.
    }
  }, [sessions, loaded]);

  function openNewForm() {
    setDraft(emptyDraft());
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(session: Session) {
    setDraft(session);
    setEditingId(session.id);
    setShowForm(true);
  }

  function saveDraft() {
    if (!draft.subject.trim()) return;
    if (editingId) {
      setSessions((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...draft } : s)));
    } else {
      setSessions((prev) => [...prev, { ...draft, id: crypto.randomUUID(), completed: false }]);
    }
    setShowForm(false);
  }

  function toggleComplete(id: string) {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
  }

  function removeSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  const sorted = [...sessions].sort((a, b) => {
    const aKey = `${a.date}T${a.startTime}`;
    const bKey = `${b.date}T${b.startTime}`;
    return aKey.localeCompare(bKey);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          {sessions.length} session{sessions.length === 1 ? "" : "s"} &middot;{" "}
          {sessions.filter((s) => s.completed).length} completed
        </p>
        <Button type="button" size="sm" onClick={openNewForm}>
          <Plus className="size-3.5" />
          Add session
        </Button>
      </div>

      {showForm && (
        <div className="space-y-4 rounded-md border border-accent/40 bg-panel-raised p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="draft-subject">Subject</Label>
              <Input
                id="draft-subject"
                value={draft.subject}
                onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
                placeholder="Biology"
              />
            </div>
            <div>
              <Label htmlFor="draft-topic">Topic</Label>
              <Input
                id="draft-topic"
                value={draft.topic}
                onChange={(e) => setDraft((d) => ({ ...d, topic: e.target.value }))}
                placeholder="Cell division"
              />
            </div>
            <div>
              <Label htmlFor="draft-date">Date</Label>
              <Input id="draft-date" type="date" value={draft.date} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="draft-start">Start</Label>
                <Input id="draft-start" type="time" value={draft.startTime} onChange={(e) => setDraft((d) => ({ ...d, startTime: e.target.value }))} />
              </div>
              <div className="flex-1">
                <Label htmlFor="draft-end">End</Label>
                <Input id="draft-end" type="time" value={draft.endTime} onChange={(e) => setDraft((d) => ({ ...d, endTime: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label htmlFor="draft-priority">Priority</Label>
              <Select
                id="draft-priority"
                value={draft.priority}
                onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value as Session["priority"] }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="draft-notes">Notes</Label>
            <Textarea
              id="draft-notes"
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              className="min-h-20 font-sans text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={saveDraft} disabled={!draft.subject.trim()}>
              <Check className="size-3.5" />
              Save session
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)}>
              <X className="size-3.5" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-ink-muted">
          No study sessions yet. Add one to get started.
        </div>
      ) : (
        <ul className="space-y-2">
          {sorted.map((s) => (
            <li
              key={s.id}
              className={cn(
                "rounded-md border p-3.5 transition-colors",
                s.completed ? "border-border bg-panel-raised opacity-60" : "border-border bg-panel"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("font-display text-sm font-semibold text-ink", s.completed && "line-through")}>
                      {s.subject}
                    </span>
                    {s.topic && <span className="text-sm text-ink-muted">&mdash; {s.topic}</span>}
                    <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", priorityStyles[s.priority])}>
                      {s.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">
                    {s.date} &middot; {s.startTime}
                    {"\u2013"}
                    {s.endTime}
                  </p>
                  {s.notes && <p className="mt-1.5 text-sm text-ink-muted">{s.notes}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button type="button" variant="ghost" size="sm" aria-label={s.completed ? "Mark incomplete" : "Mark complete"} onClick={() => toggleComplete(s.id)} className="px-1.5">
                    <Check className={cn("size-3.5", s.completed && "text-teal")} />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" aria-label="Edit session" onClick={() => openEditForm(s)} className="px-1.5">
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" aria-label="Delete session" onClick={() => removeSession(s.id)} className="px-1.5 text-danger hover:text-danger">
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {sessions.length > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            if (confirm("Clear all study sessions? This can't be undone.")) setSessions([]);
          }}
        >
          <RotateCcw className="size-3.5" />
          Clear all
        </Button>
      )}
    </div>
  );
}
