/**
 * Rule-based writing naturalizer.
 *
 * This is intentionally NOT an AI-detector-evasion tool: it can't verify
 * meaning was preserved, and no rule-based (or AI-based) system can
 * reliably guarantee text will pass a given AI detector, since detectors
 * vary and change over time. What it actually does, honestly:
 *
 *  - Detects a curated list of overused "AI-sounding" phrases and clichés
 *    and replaces them with plainer, more direct alternatives.
 *  - Leaves citations, numbers, and (optionally) technical terms untouched.
 *  - Computes real, standard text-readability statistics (Flesch Reading
 *    Ease, Flesch-Kincaid grade level, sentence-length variance, unique-word
 *    ratio, a heuristic formality score) so users can see concrete before/
 *    after numbers rather than an unverifiable "meaning preserved" claim.
 *
 * All processing happens synchronously in the browser; nothing is sent to
 * a server.
 */

// ---------------------------------------------------------------------------
// Public types (consumed by components/tools/ai-writing-naturalizer.tsx)
// ---------------------------------------------------------------------------

export type WritingMode =
  | "academic"
  | "formal"
  | "natural"
  | "professional"
  | "simple"
  | "conversational"
  | "custom";

export type AcademicLevel = "undergraduate" | "masters" | "phd" | "general";
export type LanguageComplexity = "simple" | "moderate" | "advanced";
export type VocabularyLevel = "simple" | "standard" | "technical" | "highly_technical";
export type RewriteStrength = "light" | "balanced" | "deep";

export interface NaturalizerOptions {
  mode: WritingMode;
  customModeDescription?: string;
  academicLevel: AcademicLevel;
  complexity: LanguageComplexity;
  formality: number; // 1-5
  sentenceVariation: number; // 1-5
  vocabulary: VocabularyLevel;
  preserveTechnicalTerms: boolean;
  thesisMode: boolean;
  strength: RewriteStrength;
  additionalInstructions?: string;
}

export interface TextStats {
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  paragraphCount: number;
  /** Human-readable Flesch-Kincaid grade band, e.g. "College (grade ~13.2)". */
  gradeLevel: string;
  /** Flesch Reading Ease, roughly 0 (very hard) to 100 (very easy). */
  fleschReadingEase: number;
  /** Population variance of sentence length in words \u2014 higher means more varied rhythm. */
  sentenceLengthVariance: number;
  /** Unique words as a percentage of total words. */
  uniqueWordsRatio: number;
  /** 0-100 heuristic: more contractions/pronouns lowers it, more long words/connectors raises it. */
  formalityScore: number;
}

interface ImprovementNote {
  label: string;
}

export interface NaturalizeResult {
  rewrittenText: string;
  processingTimeMs: number;
  statsBefore: TextStats;
  statsAfter: TextStats;
  /** How many dictionary phrase matches were found and replaced. */
  phrasesReplaced: number;
  improvements: {
    readability: ImprovementNote;
    sentenceVariation: ImprovementNote;
    vocabulary: ImprovementNote;
    formality: ImprovementNote;
    conciseness: ImprovementNote;
    /** Named to match the existing UI's "Paragraph Flow" panel. Computed as
     * the percentage of detected AI-cliché phrase matches that were
     * resolved \u2014 a real, traceable number, not a semantic judgment. */
    paragraphCoherence: { after: number; label: string };
  };
}

// ---------------------------------------------------------------------------
// Text statistics
// ---------------------------------------------------------------------------

function splitWords(text: string): string[] {
  return text.match(/[A-Za-z0-9](?:[A-Za-z0-9'-]*[A-Za-z0-9])?/g) ?? [];
}

// Sentence splitter that avoids breaking on common abbreviations.
const ABBREVIATIONS = new Set([
  "mr", "mrs", "ms", "dr", "prof", "sr", "jr", "vs", "etc", "eg", "e.g",
  "ie", "i.e", "al", "fig", "figs", "no", "vol", "pp", "p", "inc", "ltd",
  "co", "st", "approx",
]);

function splitSentences(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const raw = normalized.split(/(?<=[.!?])\s+(?=[A-Z0-9"'\u201c(])/);
  const sentences: string[] = [];
  let buffer = "";

  for (const piece of raw) {
    buffer = buffer ? `${buffer} ${piece}` : piece;
    const lastWordMatch = buffer.match(/([A-Za-z]+)\.\s*$/);
    const endsWithAbbreviation =
      lastWordMatch && ABBREVIATIONS.has(lastWordMatch[1].toLowerCase());
    if (!endsWithAbbreviation) {
      sentences.push(buffer.trim());
      buffer = "";
    }
  }
  if (buffer.trim()) sentences.push(buffer.trim());
  return sentences.filter((s) => s.length > 0);
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const trimmed = w.replace(/e$/, "").replace(/^y/, "");
  const groups = trimmed.match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

function gradeLevelLabel(grade: number): string {
  const g = Math.max(0, grade);
  let band: string;
  if (g <= 5) band = "Elementary";
  else if (g <= 8) band = "Middle School";
  else if (g <= 10) band = "High School";
  else if (g <= 13) band = "College";
  else if (g <= 16) band = "College Graduate";
  else band = "Professional / Technical";
  return `${band} (grade ~${g.toFixed(1)})`;
}

const CONTRACTION_RE = /\b\w+'(?:t|re|ve|ll|d|s|m)\b/gi;
const FIRST_SECOND_PERSON_RE = /\b(i|we|you|me|us|my|your|our|myself|yourself|ourselves)\b/gi;
const FORMAL_CONNECTOR_RE =
  /\b(however|therefore|consequently|furthermore|moreover|thus|hence|nonetheless|accordingly)\b/gi;

function calculateFormalityScore(text: string, words: string[]): number {
  if (words.length === 0) return 50;
  const contractions = (text.match(CONTRACTION_RE) ?? []).length;
  const firstSecondPerson = (text.match(FIRST_SECOND_PERSON_RE) ?? []).length;
  const formalConnectors = (text.match(FORMAL_CONNECTOR_RE) ?? []).length;
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;

  const per100 = 100 / words.length;
  let score = 50;
  score -= contractions * per100 * 4;
  score -= firstSecondPerson * per100 * 1.5;
  score += formalConnectors * per100 * 3;
  score += (avgWordLength - 4.5) * 8;

  return Math.round(clamp(score, 0, 100));
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function variance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sumSq = values.reduce((a, b) => a + (b - mean) ** 2, 0);
  return Math.round((sumSq / values.length) * 100) / 100;
}

export function calculateTextStats(text: string): TextStats {
  const words = splitWords(text);
  const sentences = splitSentences(text);
  const paragraphs = splitParagraphs(text);
  const wordCount = words.length;
  const sentenceCount = sentences.length || (wordCount > 0 ? 1 : 0);

  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

  let fleschReadingEase = 0;
  let gradeLevel = "\u2014";
  if (wordCount > 0 && sentenceCount > 0) {
    const wordsPerSentence = wordCount / sentenceCount;
    const syllablesPerWord = totalSyllables / wordCount;
    fleschReadingEase = clamp(
      206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord,
      0,
      100
    );
    const grade = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
    gradeLevel = gradeLevelLabel(grade);
  }

  const sentenceLengths = sentences.map((s) => splitWords(s).length).filter((n) => n > 0);
  const sentenceLengthVariance = variance(sentenceLengths);

  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  const uniqueWordsRatio =
    wordCount > 0 ? Math.round((uniqueWords.size / wordCount) * 1000) / 10 : 0;

  const formalityScore = calculateFormalityScore(text, words);

  return {
    wordCount,
    charCount: text.length,
    sentenceCount,
    paragraphCount: paragraphs.length || (wordCount > 0 ? 1 : 0),
    gradeLevel,
    fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
    sentenceLengthVariance,
    uniqueWordsRatio,
    formalityScore,
  };
}

// ---------------------------------------------------------------------------
// Phrase dictionary
// ---------------------------------------------------------------------------
// Each entry: [pattern (matched case-insensitively, word-boundary safe),
// replacement, tier]. Tier 1 fires at every strength; tier 2 also fires at
// "balanced" and "deep"; tier 3 only at "deep".

interface PhraseRule {
  pattern: string;
  replacement: string;
  tier: 1 | 2 | 3;
}

const PHRASE_RULES: PhraseRule[] = [
  // Tier 1 \u2014 stock openers, fillers, and transition padding.
  { pattern: "it is important to note that", replacement: "notably,", tier: 1 },
  { pattern: "it should be noted that", replacement: "notably,", tier: 1 },
  { pattern: "it is worth noting that", replacement: "notably,", tier: 1 },
  { pattern: "in today's fast-paced world", replacement: "today", tier: 1 },
  { pattern: "in this day and age", replacement: "today", tier: 1 },
  { pattern: "in conclusion, overall,", replacement: "overall,", tier: 1 },
  { pattern: "in conclusion,", replacement: "in short,", tier: 1 },
  { pattern: "to sum up,", replacement: "in short,", tier: 1 },
  { pattern: "furthermore,", replacement: "also,", tier: 1 },
  { pattern: "moreover,", replacement: "also,", tier: 1 },
  { pattern: "additionally,", replacement: "also,", tier: 1 },
  { pattern: "in addition,", replacement: "also,", tier: 1 },
  { pattern: "a testament to", replacement: "an example of", tier: 1 },
  { pattern: "serves as a testament to", replacement: "shows", tier: 1 },
  { pattern: "plays a crucial role in", replacement: "matters for", tier: 1 },
  { pattern: "plays a vital role in", replacement: "matters for", tier: 1 },
  { pattern: "it can be seen that", replacement: "", tier: 1 },
  { pattern: "it is evident that", replacement: "clearly,", tier: 1 },
  { pattern: "this paper aims to", replacement: "this paper", tier: 1 },
  { pattern: "this study aims to", replacement: "this study", tier: 1 },
  { pattern: "the purpose of this study is to", replacement: "this study", tier: 1 },

  // Tier 2 \u2014 inflated vocabulary and stiff connective phrases.
  { pattern: "utilize", replacement: "use", tier: 2 },
  { pattern: "utilizes", replacement: "uses", tier: 2 },
  { pattern: "utilized", replacement: "used", tier: 2 },
  { pattern: "utilizing", replacement: "using", tier: 2 },
  { pattern: "utilization of", replacement: "use of", tier: 2 },
  { pattern: "facilitate", replacement: "help", tier: 2 },
  { pattern: "facilitates", replacement: "helps", tier: 2 },
  { pattern: "facilitated", replacement: "helped", tier: 2 },
  { pattern: "facilitating", replacement: "helping", tier: 2 },
  { pattern: "delve into", replacement: "look at", tier: 2 },
  { pattern: "delves into", replacement: "looks at", tier: 2 },
  { pattern: "delving into", replacement: "looking at", tier: 2 },
  { pattern: "leverage", replacement: "use", tier: 2 },
  { pattern: "leverages", replacement: "uses", tier: 2 },
  { pattern: "leveraged", replacement: "used", tier: 2 },
  { pattern: "leveraging", replacement: "using", tier: 2 },
  { pattern: "robust", replacement: "reliable", tier: 2 },
  { pattern: "novel approach", replacement: "new approach", tier: 2 },
  { pattern: "myriad of", replacement: "many", tier: 2 },
  { pattern: "a plethora of", replacement: "many", tier: 2 },
  { pattern: "a wide range of", replacement: "many", tier: 2 },
  { pattern: "in order to", replacement: "to", tier: 2 },
  { pattern: "due to the fact that", replacement: "because", tier: 2 },
  { pattern: "owing to the fact that", replacement: "because", tier: 2 },
  { pattern: "with regard to", replacement: "regarding", tier: 2 },
  { pattern: "with respect to", replacement: "regarding", tier: 2 },
  { pattern: "in the realm of", replacement: "in", tier: 2 },
  { pattern: "in terms of", replacement: "for", tier: 2 },
  { pattern: "navigate the landscape of", replacement: "work within", tier: 2 },
  { pattern: "at this point in time", replacement: "now", tier: 2 },
  { pattern: "in the event that", replacement: "if", tier: 2 },
  { pattern: "on a daily basis", replacement: "daily", tier: 2 },
  { pattern: "the fact that", replacement: "that", tier: 2 },
  { pattern: "a significant number of", replacement: "many", tier: 2 },
  { pattern: "the vast majority of", replacement: "most", tier: 2 },
];

// ---------------------------------------------------------------------------
// Citation / number protection
// ---------------------------------------------------------------------------

// (Author, 2024), (Author et al., 2024), [12], [12\u201315], p < 0.05, 92.4%.
const PROTECTED_SPAN_RE = new RegExp(
  [
    "\\([A-Z][\\w.-]*(?:\\s+et al\\.)?,?\\s*\\d{4}[a-z]?\\)",
    "\\[\\d+(?:\\s*[\\u2013\\u2012-]\\s*\\d+)?\\]",
    "\\bp\\s*[<>=]\\s*0?\\.\\d+",
    "\\b\\d+(?:\\.\\d+)?\\s*%",
  ].join("|"),
  "g"
);

function protectSpans(text: string): { masked: string; restore: (masked: string) => string } {
  const placeholders: string[] = [];
  const masked = text.replace(PROTECTED_SPAN_RE, (match) => {
    const token = `\u0000${placeholders.length}\u0000`;
    placeholders.push(match);
    return token;
  });
  const restore = (maskedText: string) =>
    maskedText.replace(/\u0000(\d+)\u0000/g, (_m, idx) => placeholders[Number(idx)] ?? "");
  return { masked, restore };
}

// ---------------------------------------------------------------------------
// Phrase replacement
// ---------------------------------------------------------------------------

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** \b only asserts a transition between a word character and a non-word
 * character. Several dictionary phrases end in punctuation (e.g.
 * "furthermore,"), where \b right after the comma never matches because
 * both the comma and the whitespace that follows it are non-word
 * characters. Anchors are only added on sides that actually start/end on
 * a word character. */
function boundaryPattern(phrase: string): string {
  const escaped = escapeRegExp(phrase);
  const startsWithWord = /^\w/.test(phrase);
  const endsWithWord = /\w$/.test(phrase);
  return `${startsWithWord ? "\\b" : ""}${escaped}${endsWithWord ? "\\b" : ""}`;
}

function matchCase(source: string, replacement: string): string {
  if (!replacement) return replacement;
  if (source === source.toUpperCase() && /[A-Z]/.test(source)) {
    return replacement.toUpperCase();
  }
  if (/^[A-Z]/.test(source)) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function applyPhraseRules(
  text: string,
  strength: RewriteStrength
): { text: string; replacedCount: number } {
  const maxTier = strength === "light" ? 1 : strength === "balanced" ? 2 : 3;
  const rules = PHRASE_RULES.filter((r) => r.tier <= maxTier).sort(
    (a, b) => b.pattern.length - a.pattern.length
  );

  let replacedCount = 0;
  let result = text;

  for (const rule of rules) {
    const re = new RegExp(boundaryPattern(rule.pattern), "gi");
    result = result.replace(re, (match) => {
      replacedCount++;
      return matchCase(match, rule.replacement);
    });
  }

  // Clean up any double spaces or stray leading commas left by removals.
  result = result
    .replace(/[ \t]{2,}/g, " ")
    .replace(/,\s*,/g, ",")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/^\s*,\s*/gm, "");

  return { text: result, replacedCount };
}

// ---------------------------------------------------------------------------
// Deep-strength extras: split very long sentences, rotate repeated
// paragraph-initial transition words.
// ---------------------------------------------------------------------------

const ROTATING_OPENERS = ["Also,", "On top of that,", "What's more,", "Beyond that,"];

function applyDeepPass(text: string): string {
  const paragraphs = splitParagraphs(text);
  let openerIndex = 0;

  const rewritten = paragraphs.map((paragraph) => {
    const sentences = splitSentences(paragraph);
    const seenOpeners = new Map<string, number>();

    const adjusted = sentences.map((sentence) => {
      let s = sentence;

      // Split overly long sentences at a coordinating conjunction.
      const words = splitWords(s);
      if (words.length > 32) {
        const splitPoint = s.search(/,\s+(and|but|so)\s+/i);
        if (splitPoint > 20) {
          const match = s.match(/,\s+(and|but|so)\s+/i);
          if (match && match.index !== undefined) {
            const before = s.slice(0, match.index).trim();
            const after = s.slice(match.index + match[0].length).trim();
            const capitalizedAfter = after.charAt(0).toUpperCase() + after.slice(1);
            s = `${before}. ${capitalizedAfter}`;
          }
        }
      }

      // Rotate repeated sentence-initial transition words within a paragraph.
      const openerMatch = s.match(/^(Also|Furthermore|Moreover|Additionally),/);
      if (openerMatch) {
        const key = openerMatch[1].toLowerCase();
        const count = seenOpeners.get(key) ?? 0;
        seenOpeners.set(key, count + 1);
        if (count > 0) {
          // Never rotate a word into itself (e.g. "Also," repeated twice
          // should not "rotate" to "Also," again).
          const candidates = ROTATING_OPENERS.filter(
            (o) => o.toLowerCase() !== openerMatch[0].toLowerCase()
          );
          const replacement = candidates[openerIndex % candidates.length];
          openerIndex++;
          s = s.replace(openerMatch[0], replacement);
        }
      }

      return s;
    });

    return adjusted.join(" ");
  });

  return rewritten.join("\n\n");
}

// ---------------------------------------------------------------------------
// Improvement labels
// ---------------------------------------------------------------------------

function readabilityLabel(before: number, after: number): string {
  const delta = after - before;
  if (Math.abs(delta) < 2) return "Comparable readability";
  return delta > 0 ? `Easier to read (+${delta.toFixed(1)})` : `Denser (${delta.toFixed(1)})`;
}

function sentenceVariationLabel(before: number, after: number): string {
  const delta = after - before;
  if (Math.abs(delta) < 1) return "Comparable rhythm";
  return delta > 0 ? "More varied sentence length" : "More consistent sentence length";
}

function vocabularyLabel(before: number, after: number): string {
  const delta = after - before;
  if (Math.abs(delta) < 1) return "Comparable vocabulary diversity";
  return delta > 0 ? "More diverse word choice" : "More repetition in word choice";
}

function formalityLabel(score: number): string {
  if (score >= 75) return "Highly formal";
  if (score >= 50) return "Formal";
  if (score >= 25) return "Neutral";
  return "Casual";
}

function concisenessLabel(before: number, after: number): string {
  const delta = after - before;
  if (delta === 0) return "Same length";
  const pct = before > 0 ? Math.round((Math.abs(delta) / before) * 100) : 0;
  return delta < 0 ? `${Math.abs(delta)} fewer words (\u2212${pct}%)` : `${delta} more words (+${pct}%)`;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export async function naturalizeText(
  text: string,
  options: NaturalizerOptions
): Promise<NaturalizeResult> {
  const start =
    typeof performance !== "undefined" ? performance.now() : Date.now();

  const statsBefore = calculateTextStats(text);

  // Detect how many phrase matches exist in the ORIGINAL text (at the max
  // tier the chosen strength allows), so the "resolved" percentage below is
  // meaningful even for the light/balanced tiers.
  const maxTier = options.strength === "light" ? 1 : options.strength === "balanced" ? 2 : 3;
  const totalDetectable = PHRASE_RULES.filter((r) => r.tier <= maxTier).reduce((sum, rule) => {
    const re = new RegExp(boundaryPattern(rule.pattern), "gi");
    return sum + (text.match(re)?.length ?? 0);
  }, 0);

  const { masked, restore } = options.preserveTechnicalTerms
    ? protectSpans(text)
    : { masked: text, restore: (t: string) => t };

  const { text: phraseRewritten, replacedCount } = applyPhraseRules(masked, options.strength);

  const useContractions = options.mode === "conversational" || options.mode === "simple";
  let styled = phraseRewritten;
  if (useContractions) {
    styled = styled
      .replace(/\bit is\b/gi, (m) => matchCase(m, "it's"))
      .replace(/\bdo not\b/gi, (m) => matchCase(m, "don't"))
      .replace(/\bcannot\b/gi, (m) => matchCase(m, "can't"))
      .replace(/\bwill not\b/gi, (m) => matchCase(m, "won't"));
  }

  if (options.strength === "deep") {
    styled = applyDeepPass(styled);
  }

  const restored = restore(styled);
  const rewrittenText = restored.trim();

  const statsAfter = calculateTextStats(rewrittenText);
  const end = typeof performance !== "undefined" ? performance.now() : Date.now();

  const coherenceAfter =
    totalDetectable > 0 ? Math.round((replacedCount / totalDetectable) * 100) : 100;
  const coherenceLabel =
    totalDetectable === 0
      ? "No stock phrasing detected"
      : replacedCount === 0
        ? "No changes applied"
        : `${replacedCount} AI-pattern phrase${replacedCount === 1 ? "" : "s"} smoothed`;

  return {
    rewrittenText,
    processingTimeMs: Math.max(1, Math.round(end - start)),
    statsBefore,
    statsAfter,
    phrasesReplaced: replacedCount,
    improvements: {
      readability: {
        label: readabilityLabel(statsBefore.fleschReadingEase, statsAfter.fleschReadingEase),
      },
      sentenceVariation: {
        label: sentenceVariationLabel(
          statsBefore.sentenceLengthVariance,
          statsAfter.sentenceLengthVariance
        ),
      },
      vocabulary: {
        label: vocabularyLabel(statsBefore.uniqueWordsRatio, statsAfter.uniqueWordsRatio),
      },
      formality: { label: formalityLabel(statsAfter.formalityScore) },
      conciseness: {
        label: concisenessLabel(statsBefore.wordCount, statsAfter.wordCount),
      },
      paragraphCoherence: { after: coherenceAfter, label: coherenceLabel },
    },
  };
}