// Anime avatar sprite sheet helper — generated as 5 columns × 6 rows = 30 cells.
// We expose 20 hand-picked cells for variety.
import spriteUrl from "@/assets/avatars-sprite.png";

export const AVATAR_SPRITE_URL = spriteUrl;
export const SHEET_COLS = 5;
export const SHEET_ROWS = 6;
export const AVATAR_COUNT = 20;

// Pick 20 best cells (skip a few duplicates / similar looks).
const SELECTED_CELLS = [
  0, 1, 2, 3, 4,
  5, 6, 7, 8, 9,
  10, 12, 13, 14,
  15, 17, 18,
  20, 27, 29,
];

while (SELECTED_CELLS.length < AVATAR_COUNT) SELECTED_CELLS.push(0);

export const AVATAR_NAMES = [
  "Sakura", "Kai", "Yuki", "Ren", "Hikari",
  "Luna", "Shin", "Haru", "Mei", "Akari",
  "Hana", "Sora", "Aoi", "Daichi",
  "Mira", "Riku", "Nova",
  "Bubbles", "Blaze", "Magi",
];

// Inset crop: how much of each cell's edge to trim (as fraction of cell size).
// The sprite has thin white gutters between cells; a small inset removes them
// without cropping the character. Keep this LOW so faces aren't cut off.
const INSET = 0.04;

export function getAvatarStyle(avatarId: number): React.CSSProperties {
  const cellIndex = SELECTED_CELLS[avatarId % AVATAR_COUNT] ?? 0;
  const col = cellIndex % SHEET_COLS;
  const row = Math.floor(cellIndex / SHEET_COLS);

  // Visible region per cell after insetting both sides.
  const visibleFrac = 1 - 2 * INSET; // e.g. 0.76

  // The displayed box must show only `visibleFrac` of one cell.
  // So the full sheet, scaled to background-size, must be:
  //   sheetWidthPct = (COLS / visibleFrac) * 100%
  const bgWidthPct = (SHEET_COLS / visibleFrac) * 100;
  const bgHeightPct = (SHEET_ROWS / visibleFrac) * 100;

  // We want the box to display the cell starting at offset INSET (in cell units),
  // meaning the background should be shifted left by:
  //   (col + INSET) cells worth of pixels, where 1 cell = box-size.
  // In percentage-positioning terms (where 0% = sprite-left aligns with box-left,
  // 100% = sprite-right aligns with box-right), the formula is:
  //   pos% = (offsetInCells) / (totalCells - visibleFrac) * 100
  const xPct = ((col + INSET) / (SHEET_COLS - visibleFrac)) * 100;
  const yPct = ((row + INSET) / (SHEET_ROWS - visibleFrac)) * 100;

  return {
    backgroundImage: `url(${spriteUrl})`,
    backgroundSize: `${bgWidthPct}% ${bgHeightPct}%`,
    backgroundPosition: `${xPct}% ${yPct}%`,
    backgroundRepeat: "no-repeat",
    imageRendering: "auto",
    overflow: "hidden",
  };
}
