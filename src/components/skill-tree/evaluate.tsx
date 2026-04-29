import { useState } from "react";
import { Radio, ChevronRight } from "lucide-react";
import { MobileFrame } from "./layout/MobileFrame";
import { BodyMap } from "./evaluate/BodyMap";
import { branches, branchProgress, skills, type BranchId } from "./data/skills";
import { cn } from "@/lib/utils";

export function EvaluatePage() {
  const [active, setActive] = useState<BranchId>("PUSH");
  const overall = Math.round(
    (branchProgress("PUSH") +
      branchProgress("PULL") +
      branchProgress("CORE") +
      branchProgress("LEGS")) /
      4,
  );
  const activeMeta = branches.find((b) => b.id === active)!;
  const activeSkills = skills.filter((s) => s.branch === active);

  return (
    <MobileFrame>
      <header className="p-5 border-b border-border bg-background/60">
        <div className="flex items-center gap-2 mb-1">
          <Radio className="size-3 text-primary animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
            EVAL//BODY_DIAG
          </span>
        </div>
        <div className="flex items-end justify-between">
          <h1 className="font-display text-2xl font-bold tracking-tight uppercase">
            Posture Scan
          </h1>
          <div className="text-right">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-dim">
              Overall
            </span>
            <div className="font-display text-2xl font-bold tabular-nums text-primary">
              {overall}
              <span className="text-sm text-text-dim">%</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        {/* Body map area */}
        <div className="relative px-4 pt-6 pb-2">
          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <span className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase">
              SUBJECT_01 / FRONT
            </span>
          </div>
          <BodyMap active={active} onSelect={setActive} />
        </div>

        {/* Branch breakdown */}
        <section className="px-4 pb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
              // Chain Breakdown
            </span>
            <span className="font-mono text-[9px] text-text-dim">
              TAP TO INSPECT
            </span>
          </div>

          <div className="space-y-2">
            {branches.map((b) => {
              const pct = branchProgress(b.id);
              const isActive = b.id === active;
              return (
                <button
                  key={b.id}
                  onClick={() => setActive(b.id)}
                  className={cn(
                    "w-full text-left border p-3 transition-all relative",
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border bg-surface/50 hover:bg-surface",
                  )}
                >
                  {isActive && (
                    <>
                      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-primary" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-primary" />
                    </>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-display font-bold uppercase tracking-tight text-sm",
                          isActive ? "text-primary" : "text-foreground",
                        )}
                      >
                        {b.id}
                      </span>
                      <span className="font-mono text-[9px] text-text-dim tracking-widest">
                        {b.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-display text-sm font-bold tabular-nums",
                          isActive ? "text-primary" : "text-foreground",
                        )}
                      >
                        {pct}%
                      </span>
                      <ChevronRight
                        className={cn(
                          "size-3.5",
                          isActive ? "text-primary" : "text-text-dim",
                        )}
                      />
                    </div>
                  </div>
                  <div className="h-1 bg-muted overflow-hidden relative">
                    <div
                      className={cn(
                        "h-full transition-all duration-700",
                        isActive ? "bg-primary" : "bg-foreground/40",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active branch readout */}
          <div className="mt-4 border border-primary/30 bg-surface/60 p-3 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-primary" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-primary" />
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                // {activeMeta.code} READOUT
              </span>
              <span className="font-mono text-[9px] text-text-dim tabular-nums">
                {activeSkills.filter((s) => s.status === "mastered").length}/
                {activeSkills.length} NODES
              </span>
            </div>
            <p className="font-display uppercase text-sm font-medium mb-2 tracking-tight">
              {activeMeta.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activeSkills.map((s) => (
                <span
                  key={s.id}
                  className={cn(
                    "font-mono text-[9px] px-1.5 py-0.5 border tracking-widest",
                    s.status === "mastered" &&
                      "border-primary/50 text-primary bg-primary/10",
                    s.status === "in-progress" &&
                      "border-foreground/50 text-foreground",
                    s.status === "available" &&
                      "border-border text-muted-foreground",
                    s.status === "locked" && "border-border/50 text-text-dim",
                  )}
                >
                  {s.callsign}
                  {s.status === "in-progress" && ` ${s.progress}%`}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </MobileFrame>
  );
}
