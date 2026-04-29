import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  User,
  MessageCircle,
  X,
  Crosshair,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const upcomingBookings = [
  {
    date: "Apr 12, 2026",
    time: "10:00 - 11:00",
    trainer: "Coach Alex",
    status: "confirmed",
  },
  {
    date: "Apr 14, 2026",
    time: "14:00 - 15:00",
    trainer: "Coach Alex",
    status: "confirmed",
  },
  {
    date: "Apr 17, 2026",
    time: "09:00 - 10:30",
    trainer: "Coach Alex",
    status: "shifted",
  },
];

const trainingBalances = [
  {
    id: "online-intermediate",
    plan: "ONLINE INTERMEDIATE",
    mode: "Online",
    perTime: "1 hour 30 mins",
    remainingTimes: 14,
    note: "Best for strength and control progression.",
  },
  {
    id: "onsite-basis",
    plan: "ONSITE BASIS",
    mode: "Onsite",
    perTime: "1 hour",
    remainingTimes: 3,
    note: "Great for form correction with direct coaching.",
  },
];

const Dashboard = () => {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      <div className="container max-w-4xl pt-20 pb-16">
        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-display text-sm font-semibold text-foreground">
              Schedule Change
            </p>
            <p className="text-sm text-muted-foreground">
              Your training on Apr 17 has been shifted from 08:00 to 09:00.
              Please confirm.
            </p>
          </div>
        </motion.div>

        <Link
          to="/skilltree"
          className="group mt-4 flex items-center justify-between rounded-xl border border-primary/40 bg-linear-to-r from-primary/10 via-primary/5 to-card p-4 transition-all duration-300 hover:border-primary hover:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.35)]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
              <Crosshair className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-display text-base font-bold text-foreground">
                Skill Tree
              </p>
              <p className="text-xs text-muted-foreground">
                View progression, unlocks, and body evaluation.
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-transform duration-200 group-hover:translate-x-0.5">
            <ChevronRight className="h-5 w-5" />
          </div>
        </Link>

        {/* Bookings */}
        <div className="mt-8">
          <h2 className="font-display text-lg font-bold text-foreground">
            Upcoming Trainings
          </h2>

          <div className="mt-4 space-y-3">
            {upcomingBookings.map((booking, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  booking.status === "shifted"
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md bg-secondary">
                    <span className="text-xs text-muted-foreground">
                      {booking.date.split(" ")[0]}
                    </span>
                    <span className="font-display text-lg font-bold text-foreground">
                      {booking.date.split(" ")[1].replace(",", "")}
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground">
                      {booking.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.trainer}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    booking.status === "shifted"
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {booking.status.toUpperCase()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="my-6" aria-hidden="true">
          <div className="h-px w-full bg-border" />
        </div>

        {/* Contact Trainer — Hero CTA */}
        <h2 className="font-display text-lg font-bold text-foreground">
          Contact Trainer
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          onClick={() => setShowContact(true)}
          className="group mt-6 cursor-pointer overflow-hidden rounded-xl border-2 border-primary/40 bg-linear-to-r from-primary/10 via-primary/5 to-card p-5 transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/30">
                <User className="h-7 w-7 text-primary" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-primary" />
                </span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-foreground">
                  Coach Alex
                </p>
                <p className="text-sm text-muted-foreground">
                  Ask me anything you wonder — I'm always here for you! 💬
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-lg transition-transform duration-200 group-hover:scale-105">
              <MessageCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Chat Now</span>
            </div>
          </div>
        </motion.div>

        <div className="my-6" aria-hidden="true">
          <div className="h-px w-full bg-border" />
        </div>

        {/* Training Balance */}
        <div className="mt-8">
          <h2 className="font-display text-lg font-bold text-foreground">
            Training Balance
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Detailed view of your active plans and remaining training times.
          </p>

          <div className="mt-4 space-y-3">
            {trainingBalances.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">
                      {item.plan}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.mode} · {item.perTime} per time
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {item.remainingTimes} times left
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {item.note}
                </p>
              </div>
            ))}

            <p className="mt-3 text-xs text-muted-foreground">
              Balance updates after each completed training.
            </p>
          </div>
        </div>

        {/* Trainer Contact Popup */}
        <AnimatePresence>
          {showContact && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setShowContact(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowContact(false)}
                  className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                    Coach Alex
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Personal Trainer
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground italic">
                    "Hey! Feel free to ask me anything you're curious about —
                    training, nutrition, or just life. I'm here for you! 💪"
                  </p>

                  <a
                    href="https://m.me/coachalex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat on Messenger
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
