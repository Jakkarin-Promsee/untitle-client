import { Lock, Check } from "lucide-react";
import type { Skill } from "../data/skills";
import { cn } from "@/lib/utils";

type Props = {
  skill: Skill;
  align: "left" | "right" | "center";
  selected: boolean;
  onSelect: (id: string) => void;
};

export function SkillNode({ skill, align, selected, onSelect }: Props) {
  const justify =
    align === "left"
      ? "justify-start pl-2"
      : align === "right"
        ? "justify-end pr-2"
        : "justify-center";

  const isMastered = skill.status === "mastered";
  const isProgress = skill.status === "in-progress";
  const isAvailable = skill.status === "available";
  const isLocked = skill.status === "locked";

  const sizeClass = isProgress ? "size-20" : "size-16";

  const baseDiamond =
    "rotate-45 flex items-center justify-center border-4 border-background transition-all duration-200 active:scale-95";

  const stateClasses = isMastered
    ? "bg-primary glow-orange"
    : isProgress
      ? "bg-foreground"
      : isAvailable
        ? "bg-muted border-foreground/60"
        : "bg-background border-dashed border-border";

  const labelColor = isLocked
    ? "text-text-dim"
    : isMastered
      ? "text-primary"
      : isProgress
        ? "text-foreground"
        : "text-muted-foreground";

  return (
    <div className={cn("flex w-full", justify)}>
      <button
        type="button"
        onClick={() => onSelect(skill.id)}
        disabled={isLocked}
        className={cn(
          "relative group focus:outline-none",
          isLocked && "opacity-40 cursor-not-allowed",
          selected && "z-20",
        )}
        aria-label={`${skill.name} — ${skill.status}`}
      >
        {/* Selection ring */}
        {selected && (
          <div className="absolute -inset-3 border border-primary/60 rotate-45 animate-node-pulse" />
        )}

        {isProgress && !selected && (
          <div className="absolute -inset-2 border border-foreground/10 rotate-45" />
        )}

        <div className={cn(sizeClass, baseDiamond, stateClasses)}>
          <div className="-rotate-45 flex flex-col items-center justify-center gap-0.5">
            {isLocked ? (
              <Lock className="size-4 text-text-dim" strokeWidth={2} />
            ) : isMastered ? (
              <Check
                className="size-5 text-primary-foreground"
                strokeWidth={3}
              />
            ) : (
              <span
                className={cn(
                  "font-display font-bold text-[10px] tracking-tight",
                  isProgress ? "text-background" : "text-foreground",
                )}
              >
                {skill.callsign}
              </span>
            )}
            {isProgress && (
              <span className="font-mono text-[8px] text-background/70 tabular-nums">
                {skill.progress}%
              </span>
            )}
          </div>
        </div>

        {/* Label */}
        <div
          className={cn(
            "absolute top-full mt-4 whitespace-nowrap left-1/2 -translate-x-1/2 text-center",
          )}
        >
          <span
            className={cn("font-mono text-[9px] tracking-widest", labelColor)}
          >
            {skill.code}
          </span>
          {isProgress && (
            <div className="flex items-center gap-1.5 mt-1 justify-center">
              <div className="size-1 bg-primary rounded-full animate-pulse" />
              <span className="font-mono text-[9px] text-primary tracking-widest">
                DECODING
              </span>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
