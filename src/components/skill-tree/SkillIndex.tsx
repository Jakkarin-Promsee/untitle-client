import { useMemo, useState } from "react";
import { Radio } from "lucide-react";
import { skills, branches, type Skill } from "./data/skills";
import { SkillNode } from "./tree/SkillNode";
import { SkillDetailDialog } from "./tree/SkillDetailDialog";
import { MobileFrame } from "./layout/MobileFrame";
import { cn } from "@/lib/utils";

export function SkillIndex() {
  const [activeBranch, setActiveBranch] =
    useState<(typeof branches)[number]["id"]>("PUSH");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const branchSkills = useMemo(
    () =>
      skills
        .filter((s) => s.branch === activeBranch)
        .sort((a, b) => a.tier - b.tier),
    [activeBranch],
  );

  const selected = useMemo<Skill | null>(
    () => skills.find((s) => s.id === selectedId) ?? null,
    [selectedId],
  );

  const totalXp = skills
    .filter((s) => s.status === "mastered")
    .reduce((acc, s) => acc + s.xp, 0);
  const xpGoal = 5000;
  const pct = Math.min(100, Math.round((totalXp / xpGoal) * 100));

  const align = (i: number): "left" | "right" | "center" =>
    i % 3 === 0 ? "right" : i % 3 === 1 ? "left" : "center";

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  return (
    <MobileFrame>
      {/* HEADER */}
      <header className="p-5 border-b border-border relative z-10 bg-background/60">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="size-3 text-primary animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                POSTURE//OPS
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight uppercase">
              Callsign_Void
            </h1>
          </div>
          <div className="text-right">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">
              Rank
            </span>
            <div className="font-display text-xl font-medium tabular-nums">
              LVL.<span className="text-primary"> 14</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground tracking-widest">
            <span>DATA_SYNC: {pct}%</span>
            <span className="tabular-nums">
              {totalXp.toLocaleString()} / {xpGoal.toLocaleString()} XP
            </span>
          </div>
          <div className="h-1 bg-muted overflow-hidden relative">
            <div
              className="h-full bg-primary transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
            <div className="absolute inset-0 grid grid-cols-10 pointer-events-none">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="border-r border-background/40 last:border-0"
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* BRANCH SELECTOR */}
      <nav className="flex border-b border-border bg-background/40">
        {branches.map((b) => {
          const active = b.id === activeBranch;
          return (
            <button
              key={b.id}
              onClick={() => setActiveBranch(b.id)}
              className={cn(
                "flex-1 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors relative",
                active
                  ? "text-primary"
                  : "text-text-dim hover:text-muted-foreground",
              )}
            >
              {b.id}
              {active && (
                <div className="absolute bottom-0 left-2 right-2 h-px bg-primary" />
              )}
            </button>
          );
        })}
      </nav>

      {/* SKILL TREE */}
      <main className="flex-1 relative overflow-hidden min-h-[480px]">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[480px] border border-border rounded-full opacity-30 pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 border border-border rounded-full opacity-50 pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 border border-primary/30 rounded-full opacity-60 pointer-events-none"
          aria-hidden
        />

        <div className="absolute left-0 right-0 top-0 scanline animate-radar pointer-events-none" />

        <div className="absolute left-1/2 top-6 bottom-6 w-px bg-border -translate-x-1/2 pointer-events-none" />

        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="font-mono text-[9px] tracking-[0.3em] text-text-dim uppercase">
            {branches.find((b) => b.id === activeBranch)?.code}
          </span>
        </div>

        <div className="relative z-10 p-6 pt-12 pb-16 space-y-16">
          {branchSkills.map((skill, i) => (
            <SkillNode
              key={skill.id}
              skill={skill}
              align={align(i)}
              selected={selectedId === skill.id && open}
              onSelect={handleSelect}
            />
          ))}
          {branchSkills.length === 0 && (
            <div className="flex items-center justify-center h-40">
              <span className="font-mono text-xs text-text-dim">
                // NO PROTOCOLS DETECTED
              </span>
            </div>
          )}
        </div>
      </main>

      <SkillDetailDialog skill={selected} open={open} onOpenChange={setOpen} />
    </MobileFrame>
  );
}
