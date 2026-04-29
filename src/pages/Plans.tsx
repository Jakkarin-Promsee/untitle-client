import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Zap, Check, X as XIcon, Monitor, Users } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import TransactionModal from "@/components/TransactionModal";
import { useAuthStore } from "@/stores/auth.store";

const onlinePlans = [
  {
    title: "ONLINE BASIS",
    duration: "1 time training · 1 hour",
    price: 2500,
    purpose:
      "Best for beginners who have never trained calisthenics before and need strong fundamentals.",
    features: [
      "Live 1-on-1 video coaching",
      "Fundamental movement breakdown",
      "Personal warm-up routine",
      "Beginner-friendly guidance",
    ],
    type: "online" as const,
  },
  {
    title: "ONLINE INTERMEDIATE",
    duration: "1 time training · 1 hour 30 mins",
    price: 5500,
    purpose:
      "For trainees who want to improve strength, control, and take their training to the next level.",
    features: [
      "Live skill refinement session",
      "Technique correction and progression",
      "Strength-focused training structure",
      "Direct coach feedback",
    ],
    popular: true,
    type: "online" as const,
  },
  {
    title: "ONLINE ADVANCED",
    duration: "1 time training · 1 hour 30 mins",
    price: 9000,
    purpose:
      "For serious athletes who want pro-level coaching and advanced movement performance.",
    features: [
      "High-level 1-on-1 coaching",
      "Advanced movement analysis",
      "Performance optimization tips",
      "Competition mindset guidance",
    ],
    type: "online" as const,
  },
];

const onsitePlans = [
  {
    title: "ONSITE BASIS",
    duration: "1 time training · 1 hour",
    price: 3500,
    purpose:
      "Best for beginners who have never trained calisthenics before and want direct in-person support.",
    features: [
      "Hands-on in-person coaching",
      "Real-time form correction",
      "Foundational movement training",
      "Beginner-focused coaching pace",
    ],
    type: "onsite" as const,
  },
  {
    title: "ONSITE INTERMEDIATE",
    duration: "1 time training · 1 hour 30 mins",
    price: 7500,
    purpose:
      "For trainees who want to develop themselves with stronger technique and better control.",
    features: [
      "Skill progression and correction",
      "Hands-on spotting support",
      "Power and control development",
      "Immediate adjustment feedback",
    ],
    popular: true,
    type: "onsite" as const,
  },
  {
    title: "ONSITE ADVANCED",
    duration: "1 time training · 1 hour 30 mins",
    price: 12000,
    purpose:
      "For athletes who want pro-level, high-intensity coaching with advanced movement execution.",
    features: [
      "Elite-level in-person coaching",
      "Complex skill progression",
      "Performance-focused drills",
      "Advanced correction and cueing",
    ],
    type: "onsite" as const,
  },
];

const onlinePros = [
  "Train from anywhere — no commute needed",
  "Flexible scheduling across time zones",
  "Lower cost than onsite training",
  "Session recordings for review",
];

const onlineCons = [
  "No hands-on form correction",
  "Requires your own equipment",
  "Internet connection dependent",
];

const onsitePros = [
  "Real-time hands-on correction & spotting",
  "Trainer brings equipment to you",
  "Higher accountability & motivation",
  "Immediate feedback on form",
];

const onsiteCons = [
  "First 30 min reserved for trainer travel",
  "Higher price point",
  "Location-dependent availability",
];

interface PlanCardProps {
  title: string;
  duration: string;
  price: number;
  purpose: string;
  features: string[];
  popular?: boolean;
  onSelect: () => void;
}

const PlanCard = ({
  title,
  duration,
  price,
  purpose,
  features,
  popular,
  onSelect,
}: PlanCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -4 }}
    className={`relative flex flex-col rounded-lg border p-6 card-hover ${
      popular
        ? "border-primary/40 border-glow bg-card"
        : "border-border bg-card"
    }`}
  >
    {popular && (
      <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
        MOST POPULAR
      </div>
    )}
    <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{purpose}</p>
    <div className="mt-6 flex items-baseline gap-1">
      <span className="font-display text-4xl font-bold text-foreground">
        ฿{price.toLocaleString()}
      </span>
      <span className="text-sm text-muted-foreground">/ time</span>
    </div>
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 text-primary" />
        <span>{duration}</span>
      </div>
      {features.map((feature, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Zap className="h-4 w-4 text-primary" />
          <span>{feature}</span>
        </div>
      ))}
    </div>
    <Button
      onClick={onSelect}
      className={`mt-8 w-full font-display font-semibold tracking-wide ${
        popular
          ? ""
          : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
      }`}
      size="lg"
    >
      SELECT PLAN
    </Button>
  </motion.div>
);

const Plans = () => {
  const location = useLocation();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isGuest = !token || !user;
  const [selectedCourse, setSelectedCourse] = useState<{
    title: string;
    price: number;
    duration: string;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    // Defer to ensure layout/animation wrappers are mounted before scrolling.
    const timer = window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div
        className={`container max-w-6xl pb-20 ${isGuest ? "pt-14" : "pt-20"}`}
      >
        {/* ONLINE SECTION */}
        <section
          id="online"
          className={`${isGuest ? "mt-8" : "mt-20"} scroll-mt-28 md:scroll-mt-32`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Monitor className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Online Training
              </h2>
              <p className="text-sm text-muted-foreground">
                Train from anywhere with video coaching
              </p>
            </div>
          </motion.div>

          {/* Pros & Cons */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-primary">
                Advantages
              </p>
              <ul className="mt-3 space-y-2">
                {onlinePros.map((pro, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-destructive">
                Considerations
              </p>
              <ul className="mt-3 space-y-2">
                {onlineCons.map((con, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <XIcon className="h-4 w-4 mt-0.5 text-destructive/60 shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {onlinePlans.map((plan) => (
              <PlanCard
                key={plan.title}
                {...plan}
                onSelect={() => {
                  setSelectedCourse(plan);
                  setModalOpen(true);
                }}
              />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="my-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            or
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* ONSITE SECTION */}
        <section id="onsite" className="scroll-mt-28 md:scroll-mt-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Onsite Training
              </h2>
              <p className="text-sm text-muted-foreground">
                In-person coaching at your location
              </p>
            </div>
          </motion.div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-primary">
                Advantages
              </p>
              <ul className="mt-3 space-y-2">
                {onsitePros.map((pro, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-destructive">
                Considerations
              </p>
              <ul className="mt-3 space-y-2">
                {onsiteCons.map((con, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <XIcon className="h-4 w-4 mt-0.5 text-destructive/60 shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {onsitePlans.map((plan) => (
              <PlanCard
                key={plan.title}
                {...plan}
                onSelect={() => {
                  setSelectedCourse(plan);
                  setModalOpen(true);
                }}
              />
            ))}
          </div>
        </section>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
};

export default Plans;
