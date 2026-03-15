import { UI_MESSAGES } from "../ui-messages";

const WARNING_GRAPHEME_THRESHOLD = 12;

export function sanitizeText(rawText: string): string {
  return rawText.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function countGraphemes(text: string): number {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text)).length;
  }

  return Array.from(text).length;
}

export function createLengthWarning(text: string): string | null {
  const graphemeCount = countGraphemes(text);

  if (graphemeCount > WARNING_GRAPHEME_THRESHOLD) {
    return UI_MESSAGES.lengthWarning.text;
  }

  return null;
}
