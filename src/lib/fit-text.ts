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

  const shorterSide = Math.min(width, height);
  const longerSide = Math.max(width, height);
  const baseFromShortSide = shorterSide * 0.42;
  const baseFromLongSide = longerSide * 0.18;
  const next = Math.floor(Math.min(baseFromShortSide, baseFromLongSide));

  return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, next));
}
