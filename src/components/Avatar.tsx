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
      data-avatar-id={avatarId}
      className={cn(
        "rounded-2xl border-2 transition-all duration-300 overflow-hidden bg-card/20 p-1.5 bg-center bg-no-repeat",
        selected
          ? "border-secondary shadow-[0_0_25px_hsl(var(--secondary)/0.8),inset_0_0_15px_hsl(var(--secondary)/0.3)] scale-110 ring-2 ring-secondary/40 ring-offset-2 ring-offset-background"
          : "border-primary/30 hover:border-primary/70 hover:scale-105",
        glow && "shadow-[0_0_40px_hsl(var(--secondary)/0.7)] border-secondary/70",
        className,
      )}
    />
  );
};
