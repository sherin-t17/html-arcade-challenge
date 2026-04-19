import avatar0 from "@/assets/avatars/avatar-0.png";
import avatar1 from "@/assets/avatars/avatar-1.png";
import avatar2 from "@/assets/avatars/avatar-2.png";
import avatar3 from "@/assets/avatars/avatar-3.png";
import avatar4 from "@/assets/avatars/avatar-4.png";
import avatar5 from "@/assets/avatars/avatar-5.png";
import avatar6 from "@/assets/avatars/avatar-6.png";
import avatar7 from "@/assets/avatars/avatar-7.png";
import avatar8 from "@/assets/avatars/avatar-8.png";
import avatar9 from "@/assets/avatars/avatar-9.png";
import avatar10 from "@/assets/avatars/avatar-10.png";
import avatar11 from "@/assets/avatars/avatar-11.png";
import avatar12 from "@/assets/avatars/avatar-12.png";
import avatar13 from "@/assets/avatars/avatar-13.png";
import avatar14 from "@/assets/avatars/avatar-14.png";
import avatar15 from "@/assets/avatars/avatar-15.png";
import avatar16 from "@/assets/avatars/avatar-16.png";
import avatar17 from "@/assets/avatars/avatar-17.png";
import avatar18 from "@/assets/avatars/avatar-18.png";
import avatar19 from "@/assets/avatars/avatar-19.png";

export const AVATAR_IMAGES = [
  avatar0,
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
  avatar12,
  avatar13,
  avatar14,
  avatar15,
  avatar16,
  avatar17,
  avatar18,
  avatar19,
] as const;

export const AVATAR_COUNT = AVATAR_IMAGES.length;

export const AVATAR_NAMES = [
  "Kai", "Yuki", "Ren", "Hikari", "Luna",
  "Shin", "Haru", "Mei", "Akari", "Hana",
  "Aoi", "Daichi", "Mira", "Riku", "Nova",
  "Sora", "Blaze", "Echo", "Rin", "Magi",
];

export function getAvatarImage(avatarId: number) {
  return AVATAR_IMAGES[((avatarId % AVATAR_COUNT) + AVATAR_COUNT) % AVATAR_COUNT] ?? avatar0;
}

