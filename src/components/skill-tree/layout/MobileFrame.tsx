import { Link, useLocation } from "react-router-dom";
import { Crosshair, Activity, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileFrame({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const tabs = [
    { to: "/dashboard", label: "Back", code: "BACK", icon: ArrowLeft },
    { to: "/skilltree", label: "Tree", code: "TREE", icon: Crosshair },
    {
      to: "/skilltree/evaluate",
      label: "Evaluate",
      code: "EVAL",
      icon: Activity,
    },
  ] as const;

  return (
    <div className="min-h-dvh bg-background text-foreground antialiased flex flex-col items-center relative overflow-hidden">
      <div
        className="fixed inset-0 grid-bg opacity-30 pointer-events-none"
        aria-hidden
      />
      <div className="relative w-full max-w-[420px] h-dvh flex flex-col border-x border-border bg-background/80 backdrop-blur-xl">
        <div className="flex-1 flex flex-col overflow-y-auto pb-16">{children}</div>

        {/* Bottom Tab Bar */}
        <nav className="sticky bottom-0 z-20 grid grid-cols-3 border-t border-primary/30 bg-background/95 backdrop-blur-xl">
          {tabs.map((t) => {
            const active = pathname === t.to;
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={cn(
                  "relative py-3 flex flex-col items-center gap-1 font-mono text-[9px] uppercase tracking-[0.25em] transition-colors",
                  active
                    ? "text-primary"
                    : "text-text-dim hover:text-muted-foreground",
                )}
              >
                <Icon className="size-4" strokeWidth={active ? 2.4 : 1.6} />
                <span>{t.code}</span>
                {active && (
                  <div className="absolute top-0 left-4 right-4 h-px bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
