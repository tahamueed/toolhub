"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";

type Phase = "focus" | "short-break" | "long-break";

const phaseLabels: Record<Phase, string> = {
  focus: "Focus",
  "short-break": "Short break",
  "long-break": "Long break",
};

export function PomodoroTimer() {
  const [focusMin, setFocusMin] = useState(25);
  const [shortBreakMin, setShortBreakMin] = useState(5);
  const [longBreakMin, setLongBreakMin] = useState(15);
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4);

  const [phase, setPhase] = useState<Phase>("focus");
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const [running, setRunning] = useState(false);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [pausedRemainingMs, setPausedRemainingMs] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const durations = useMemo(
    () => ({
      focus: focusMin * 60_000,
      "short-break": shortBreakMin * 60_000,
      "long-break": longBreakMin * 60_000,
    }),
    [focusMin, shortBreakMin, longBreakMin]
  );

  // Refs mirror the latest state for the ticking interval below, so its
  // callback (created once per run and not recreated on every state change)
  // never reads a stale phase/endAt when auto-advancing between phases.
  const phaseRef = useRef(phase);
  const endAtRef = useRef(endAt);
  const completedRef = useRef(completedFocusSessions);
  const durationsRef = useRef(durations);
  const sessionsUntilLongBreakRef = useRef(sessionsUntilLongBreak);
  useEffect(() => {
    phaseRef.current = phase;
    endAtRef.current = endAt;
    completedRef.current = completedFocusSessions;
    durationsRef.current = durations;
    sessionsUntilLongBreakRef.current = sessionsUntilLongBreak;
  });

  function startPhase(nextPhase: Phase) {
    setPhase(nextPhase);
    setEndAt(Date.now() + durationsRef.current[nextPhase]);
    setPausedRemainingMs(null);
    setRunning(true);
  }

  function advancePhase() {
    if (phaseRef.current === "focus") {
      const newCount = completedRef.current + 1;
      setCompletedFocusSessions(newCount);
      const nextPhase: Phase = newCount % sessionsUntilLongBreakRef.current === 0 ? "long-break" : "short-break";
      startPhase(nextPhase);
    } else {
      startPhase("focus");
    }
  }

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const nowTs = Date.now();
      setNow(nowTs);
      if (endAtRef.current !== null && nowTs >= endAtRef.current) {
        advancePhase();
      }
    }, 250);
    return () => clearInterval(id);
    // advancePhase/startPhase close over refs, not state, so they're
    // intentionally left out — including them would tear down and rebuild
    // the interval on every tick instead of only when running toggles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const remainingMs = useMemo(() => {
    if (!running || endAt === null) return pausedRemainingMs ?? durations[phase];
    return Math.max(0, endAt - now);
  }, [running, endAt, now, pausedRemainingMs, phase, durations]);

  function handleStart() {
    if (pausedRemainingMs !== null) {
      setEndAt(Date.now() + pausedRemainingMs);
      setPausedRemainingMs(null);
    } else {
      setEndAt(Date.now() + durations[phase]);
    }
    setRunning(true);
  }

  function handlePause() {
    setPausedRemainingMs(remainingMs);
    setRunning(false);
    setEndAt(null);
  }

  function handleReset() {
    setRunning(false);
    setEndAt(null);
    setPausedRemainingMs(null);
    setPhase("focus");
    setCompletedFocusSessions(0);
  }

  function handleSkip() {
    advancePhase();
  }

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isActive = running || pausedRemainingMs !== null;

  return (
    <div className="space-y-6">
      {!isActive && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <Label htmlFor="focus-min">Focus (min)</Label>
            <Input id="focus-min" type="number" min={1} value={focusMin} onChange={(e) => setFocusMin(Math.max(1, Number(e.target.value) || 1))} />
          </div>
          <div>
            <Label htmlFor="short-min">Short break (min)</Label>
            <Input id="short-min" type="number" min={1} value={shortBreakMin} onChange={(e) => setShortBreakMin(Math.max(1, Number(e.target.value) || 1))} />
          </div>
          <div>
            <Label htmlFor="long-min">Long break (min)</Label>
            <Input id="long-min" type="number" min={1} value={longBreakMin} onChange={(e) => setLongBreakMin(Math.max(1, Number(e.target.value) || 1))} />
          </div>
          <div>
            <Label htmlFor="sessions-count">Sessions before long break</Label>
            <Input
              id="sessions-count"
              type="number"
              min={1}
              value={sessionsUntilLongBreak}
              onChange={(e) => setSessionsUntilLongBreak(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 rounded-md border border-border bg-panel-raised py-10">
        <span className="font-mono text-xs uppercase tracking-wider text-accent">{phaseLabels[phase]}</span>
        <span className="font-mono text-6xl font-semibold tabular-nums text-ink">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        <span className="text-xs text-ink-muted">
          {completedFocusSessions} focus session{completedFocusSessions === 1 ? "" : "s"} completed
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {running ? (
          <Button type="button" onClick={handlePause}>
            <Pause className="size-4" />
            Pause
          </Button>
        ) : (
          <Button type="button" onClick={handleStart}>
            <Play className="size-4" />
            {pausedRemainingMs !== null ? "Resume" : "Start"}
          </Button>
        )}
        <Button type="button" variant="secondary" onClick={handleSkip}>
          <SkipForward className="size-4" />
          Skip
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
