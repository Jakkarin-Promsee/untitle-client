import { ArrowRight, Zap, Target, Lock } from "lucide-react";
import type { Skill } from "../data/skills";
import { cn } from "@/lib/utils";

export function SkillDetailSheet({ skill }: { skill: Skill | null }) {
  if (!skill) {
    return (
      <section className="p-6 bg-surface/90 border-t border-primary/30 backdrop-blur-xl">
        <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase text-center">
          // SELECT A NODE TO INITIATE
        </p>
      </section>
    );
  }

  const isLocked = skill.status === "locked";
  const isMastered = skill.status === "mastered";

  return (
    <section className="p-5 bg-surface/95 border-t border-primary/30 backdrop-blur-xl relative">
      {/* corner ticks */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-primary" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-primary" />

      <div className="flex gap-3 items-start mb-4">
        <div className="size-12 shrink-0 border border-primary/50 flex flex-col items-center justify-center text-primary font-mono text-[9px] leading-tight">
          <span className="opacity-60">ID</span>
          <span className="font-bold">{skill.code}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-bold tracking-tight uppercase leading-tight">
              {skill.name}
            </h3>
            <span
              className={cn(
                "shrink-0 text-[9px] font-mono px-2 py-0.5 border tracking-widest",
                isMastered
                  ? "bg-primary/10 text-primary border-primary/40"
                  : isLocked
                    ? "bg-muted/40 text-text-dim border-border"
                    : "bg-primary/10 text-primary border-primary/30",
              )}
            >
              +{skill.xp} XP
            </span>
          </div>
          <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">
            {skill.description}
          </p>
        </div>
      </div>

      {/* Telemetry */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-background/60 border border-border p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="size-3 text-primary" />
            <span className="font-mono text-[9px] text-text-dim uppercase tracking-widest">
              Target
            </span>
          </div>
          <p className="font-display text-sm font-medium tabular-nums">
            {skill.hold ?? "—"}
          </p>
        </div>
        <div className="bg-background/60 border border-border p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="size-3 text-primary" />
            <span className="font-mono text-[9px] text-text-dim uppercase tracking-widest">
              Status
            </span>
          </div>
          <p className="font-display text-sm font-medium uppercase">
            {skill.status === "in-progress"
              ? `${skill.progress}%`
              : skill.status}
          </p>
        </div>
      </div>

      <button
        disabled={isLocked}
        className={cn(
          "w-full py-3.5 font-display font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
          isLocked
            ? "bg-muted text-text-dim cursor-not-allowed"
            : isMastered
              ? "bg-foreground text-background hover:bg-foreground/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        {isLocked ? (
          <>
            <Lock className="size-3.5" /> Locked
          </>
        ) : isMastered ? (
          <>Replay Protocol</>
        ) : (
          <>
            Initialize Protocol <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </section>
  );
}
