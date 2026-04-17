import { getAvatarStyle, AVATAR_NAMES } from "@/lib/avatars";
import { cn } from "@/lib/utils";

type Props = {
  avatarId: number;
  size?: number;
  className?: string;
  glow?: boolean;
  selected?: boolean;
};

export const Avatar = ({ avatarId, size = 64, className, glow = false, selected = false }: Props) => {
  return (
    <div
      role="img"
      aria-label={AVATAR_NAMES[avatarId] ?? `Avatar ${avatarId}`}
      style={{ ...getAvatarStyle(avatarId), width: size, height: size }}
      className={cn(
        "rounded-lg border-2 transition-all",
        selected
          ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.7),inset_0_0_12px_hsl(var(--primary)/0.4)] scale-105"
          : "border-primary/20",
        glow && "shadow-[0_0_30px_hsl(var(--secondary)/0.6)] border-secondary/60",
        className,
      )}
    />
  );
};
