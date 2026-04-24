import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Zap, Check, X as XIcon, Monitor, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import TransactionModal from "@/components/TransactionModal";

const onlinePlans = [
  {
    title: "ONLINE STARTER",
    duration: "4 weeks · 8 sessions",
    price: 2500,
    purpose: "Learn calisthenics basics from anywhere with video coaching.",
    features: ["Video call sessions", "Form correction via video", "Nutrition guide", "Chat support"],
    type: "online" as const,
  },
  {
    title: "ONLINE PRO",
    duration: "8 weeks · 20 sessions",
    price: 5500,
    purpose: "Advanced remote coaching — muscle-ups, levers, and handstands.",
    features: ["HD video sessions", "Video analysis & feedback", "Custom meal plan", "Priority scheduling"],
    popular: true,
    type: "online" as const,
  },
  {
    title: "ONLINE ELITE",
    duration: "12 weeks · 36 sessions",
    price: 9000,
    purpose: "Full transformation with dedicated 1-on-1 remote coaching.",
    features: ["1-on-1 video coaching", "Daily check-ins", "Recovery protocols", "24/7 chat support"],
    type: "online" as const,
  },
];

const onsitePlans = [
  {
    title: "ONSITE STARTER",
    duration: "4 weeks · 8 sessions",
    price: 3500,
    purpose: "Hands-on foundational training at your preferred location.",
    features: ["In-person coaching", "Form correction", "Nutrition guide", "Equipment provided"],
    type: "onsite" as const,
  },
  {
    title: "ONSITE PRO",
    duration: "8 weeks · 20 sessions",
    price: 7500,
    purpose: "Advanced in-person skills training with real-time spotting.",
    features: ["Hands-on spotting", "Video analysis", "Custom meal plan", "Priority booking"],
    popular: true,
    type: "onsite" as const,
  },
  {
    title: "ONSITE ELITE",
    duration: "12 weeks · 36 sessions",
    price: 12000,
    purpose: "Full transformation with dedicated in-person coaching every session.",
    features: ["1-on-1 in-person", "Competition prep", "Recovery protocols", "24/7 support"],
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

const PlanCard = ({ title, duration, price, purpose, features, popular, onSelect }: PlanCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -4 }}
    className={`relative flex flex-col rounded-lg border p-6 card-hover ${
      popular ? "border-primary/40 border-glow bg-card" : "border-border bg-card"
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
      <span className="font-display text-4xl font-bold text-foreground">฿{price.toLocaleString()}</span>
      <span className="text-sm text-muted-foreground">/ package</span>
    </div>
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 text-primary" />
        <span>{duration}</span>
      </div>
      {features.map((feature, i) => (
        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-primary" />
          <span>{feature}</span>
        </div>
      ))}
    </div>
    <Button
      onClick={onSelect}
      className={`mt-8 w-full font-display font-semibold tracking-wide ${
        popular ? "" : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
      }`}
      size="lg"
    >
      SELECT PLAN
    </Button>
  </motion.div>
);

const Plans = () => {
  const [selectedCourse, setSelectedCourse] = useState<{ title: string; price: number; duration: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container pt-24 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary">Choose Your Path</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">Training Plans</h1>
          <p className="mt-4 mx-auto max-w-lg text-muted-foreground">
            Pick the training style that fits your life — remote or in-person — then choose the intensity that matches your goals.
          </p>
        </motion.div>

        {/* ONLINE SECTION */}
        <section className="mt-20">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Monitor className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Online Training</h2>
              <p className="text-sm text-muted-foreground">Train from anywhere with video coaching</p>
            </div>
          </motion.div>

          {/* Pros & Cons */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-primary">Advantages</p>
              <ul className="mt-3 space-y-2">
                {onlinePros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-destructive">Considerations</p>
              <ul className="mt-3 space-y-2">
                {onlineCons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
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
                onSelect={() => { setSelectedCourse(plan); setModalOpen(true); }}
              />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="my-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* ONSITE SECTION */}
        <section>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Onsite Training</h2>
              <p className="text-sm text-muted-foreground">In-person coaching at your location</p>
            </div>
          </motion.div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-primary">Advantages</p>
              <ul className="mt-3 space-y-2">
                {onsitePros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-destructive">Considerations</p>
              <ul className="mt-3 space-y-2">
                {onsiteCons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
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
                onSelect={() => { setSelectedCourse(plan); setModalOpen(true); }}
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
