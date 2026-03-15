import { countGraphemes } from "./text";

const MIN_FONT_SIZE = 40;
const MAX_FONT_SIZE = 560;

export function calculateFontSize(
  text: string,
  width: number,
  height: number
): number {
  if (!text) {
    return 120;
  }

  const graphemeCount = Math.max(countGraphemes(text), 1);
  const widthDriven = width / (graphemeCount * 0.68);
  const heightDriven = height * 0.62;
  const next = Math.floor(Math.min(widthDriven, heightDriven));

  return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, next));
}

