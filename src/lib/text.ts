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

  if (graphemeCount === 0) {
    return "文字を入力すると表示プレビューが更新されます。";
  }

  if (graphemeCount > WARNING_GRAPHEME_THRESHOLD) {
    return "文字数が多いため、自動で縮小して表示しています。";
  }

  return null;
}

