// Anime avatar sprite sheet helper — 5 columns × 6 rows = 30 cells.
// Each cell is exactly 1/5 wide × 1/6 tall, characters centered with no gutter.
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

export function getAvatarStyle(avatarId: number): React.CSSProperties {
  const cellIndex = SELECTED_CELLS[avatarId % AVATAR_COUNT] ?? 0;
  const col = cellIndex % SHEET_COLS;
  const row = Math.floor(cellIndex / SHEET_COLS);

  // Show exactly one cell. Background scaled so full sheet = COLS × box-size.
  const bgWidthPct = SHEET_COLS * 100;
  const bgHeightPct = SHEET_ROWS * 100;

  // Position so the chosen cell aligns with the box.
  // 0% = leftmost cell, 100% = rightmost cell.
  const xPct = (col / (SHEET_COLS - 1)) * 100;
  const yPct = (row / (SHEET_ROWS - 1)) * 100;

  return {
    backgroundImage: `url(${spriteUrl})`,
    backgroundSize: `${bgWidthPct}% ${bgHeightPct}%`,
    backgroundPosition: `${xPct}% ${yPct}%`,
    backgroundRepeat: "no-repeat",
    imageRendering: "auto",
    overflow: "hidden",
  };
}
