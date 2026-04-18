// Anime avatar sprite sheet helper — generated as 5 columns × 6 rows = 30 cells.
// We expose 20 hand-picked cells for variety.
import spriteUrl from "@/assets/avatars-sprite.png";

export const AVATAR_SPRITE_URL = spriteUrl;
export const SHEET_COLS = 5;
export const SHEET_ROWS = 6;
export const AVATAR_COUNT = 20;

// Pick 20 best cells (skip a few duplicates / similar looks).
// Cells are 0..29 reading left-to-right, top-to-bottom.
const SELECTED_CELLS = [
  0, 1, 2, 3, 4,        // row 0: pink twin-tail girl, blue boy, purple glasses girl, blonde, blonde 2
  5, 6, 7, 8, 9,        // row 1: silver cat girl, ninja boy, dark-hair boy, white cat girl, orange star girl
  10, 12, 13, 14,       // row 2: red girl, green hair boy, hooded boy, goggles boy
  15, 17, 18,           // row 3: lavender girl, cyan boy, orange short girl
  20, 27, 29,           // row 4-5: mint bubble girl, fire mage red, violet mage boy
];

// Pad to 20 just in case
while (SELECTED_CELLS.length < AVATAR_COUNT) SELECTED_CELLS.push(0);

export const AVATAR_NAMES = [
  "Sakura", "Kai", "Yuki", "Ren", "Hikari",
  "Luna", "Shin", "Haru", "Mei", "Akari",
  "Hana", "Sora", "Aoi", "Daichi",
  "Mira", "Riku", "Nova",
  "Bubbles", "Blaze", "Magi",
];

// Inset crop (in %) inside each cell to avoid neighbor bleed.
const INSET = 8; // crop 8% off each side of the cell

export function getAvatarStyle(avatarId: number): React.CSSProperties {
  const cellIndex = SELECTED_CELLS[avatarId % AVATAR_COUNT] ?? 0;
  const col = cellIndex % SHEET_COLS;
  const row = Math.floor(cellIndex / SHEET_COLS);

  // Effective scale: each cell occupies (100 - 2*INSET)% of the avatar box.
  // Background must be enlarged so that cropped portion fits the box.
  const cropFraction = (100 - 2 * INSET) / 100; // e.g. 0.84
  const bgWidthPct = (SHEET_COLS * 100) / cropFraction;
  const bgHeightPct = (SHEET_ROWS * 100) / cropFraction;

  // Position so the *inset center* of the cell aligns with the box.
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
