// Avatar sprite sheet helper — 4 columns × 6 rows = 24 cells.
// We use 20 distinct cells (skip duplicates from the generated sheet).
import spriteUrl from "@/assets/avatars-sprite.png";

export const AVATAR_SPRITE_URL = spriteUrl;
export const AVATAR_COLS = 4;
export const AVATAR_ROWS = 6;

// 20 selected indices into the 4x6 grid (skip duplicate fox/wolf at row 4 cells 0 & 3).
const SELECTED_CELLS = [
  0, 1, 2, 3,    // wizard, elf, hero, mermaid
  4, 5, 6, 7,    // ninja-ish/rocket, race car, helicopter, ufo
  8, 9, 10, 11,  // train, fox, tiger, ufo small
  13, 14,        // panda, lion (skip duplicate fox at 12, wolf at 15 stays)
  16, 17, 18, 19, // hibiscus pink, hibiscus red, clover, moon
  20, 21,        // robot, alien
];

// Ensure exactly 20
while (SELECTED_CELLS.length < 20) SELECTED_CELLS.push(SELECTED_CELLS.length);

export const AVATAR_NAMES = [
  "Wizard", "Elf", "Hero", "Mermaid",
  "Rocket", "Racer", "Chopper", "UFO",
  "Train", "Fox", "Tiger", "Saucer",
  "Panda", "Lion",
  "Blossom", "Hibiscus", "Clover", "Moon",
  "Robot", "Alien",
];

export const AVATAR_COUNT = 20;

export function getAvatarStyle(avatarId: number): React.CSSProperties {
  const cellIndex = SELECTED_CELLS[avatarId % AVATAR_COUNT];
  const col = cellIndex % AVATAR_COLS;
  const row = Math.floor(cellIndex / AVATAR_COLS);
  // bg-size 400% 600% means cell width = 100/(cols-1)% steps... actually:
  // background-position percent = (col / (cols-1)) * 100 etc.
  const xPct = (col / (AVATAR_COLS - 1)) * 100;
  const yPct = (row / (AVATAR_ROWS - 1)) * 100;
  return {
    backgroundImage: `url(${spriteUrl})`,
    backgroundSize: `${AVATAR_COLS * 100}% ${AVATAR_ROWS * 100}%`,
    backgroundPosition: `${xPct}% ${yPct}%`,
    backgroundRepeat: "no-repeat",
    imageRendering: "pixelated",
  };
}
