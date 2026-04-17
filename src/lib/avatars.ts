// Anime avatar sprite sheet helper — 4 columns × 5 rows = 20 cells.
import spriteUrl from "@/assets/avatars-sprite.png";

export const AVATAR_SPRITE_URL = spriteUrl;
export const AVATAR_COLS = 4;
export const AVATAR_ROWS = 5;
export const AVATAR_COUNT = 20;

export const AVATAR_NAMES = [
  "Sakura", "Kai", "Yuki", "Ren",
  "Hikari", "Shin", "Akari", "Haru",
  "Mei", "Sora", "Luna", "Riku",
  "Aoi", "Daichi", "Nova", "Leo",
  "Mira", "Kazuki", "Hana", "Yuto",
];

export function getAvatarStyle(avatarId: number): React.CSSProperties {
  const cellIndex = avatarId % AVATAR_COUNT;
  const col = cellIndex % AVATAR_COLS;
  const row = Math.floor(cellIndex / AVATAR_COLS);
  const xPct = (col / (AVATAR_COLS - 1)) * 100;
  const yPct = (row / (AVATAR_ROWS - 1)) * 100;
  return {
    backgroundImage: `url(${spriteUrl})`,
    backgroundSize: `${AVATAR_COLS * 100}% ${AVATAR_ROWS * 100}%`,
    backgroundPosition: `${xPct}% ${yPct}%`,
    backgroundRepeat: "no-repeat",
    imageRendering: "auto",
  };
}
