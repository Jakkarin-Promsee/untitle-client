import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, AlertTriangle, User, Zap, MessageCircle, X } from "lucide-react";
import Navbar from "@/components/Navbar";

const upcomingBookings = [
  { date: "Apr 12, 2026", time: "10:00 - 11:00", trainer: "Coach Alex", status: "confirmed" },
  { date: "Apr 14, 2026", time: "14:00 - 15:00", trainer: "Coach Alex", status: "confirmed" },
  { date: "Apr 17, 2026", time: "09:00 - 10:30", trainer: "Coach Alex", status: "shifted" },
];

const Dashboard = () => {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <div className="container pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary">Overview</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Dashboard</h1>
        </motion.div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Remaining Sessions", value: "14", icon: Zap },
            { label: "Upcoming Bookings", value: "3", icon: Calendar },
            { label: "Your Trainer", value: "Coach Alex", icon: User },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Trainer — Hero CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          onClick={() => setShowContact(true)}
          className="group mt-6 cursor-pointer overflow-hidden rounded-xl border-2 border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-5 transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]"
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
                <p className="font-display text-lg font-bold text-foreground">Coach Alex</p>
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

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-display text-sm font-semibold text-foreground">Schedule Change</p>
            <p className="text-sm text-muted-foreground">
              Your session on Apr 17 has been shifted from 08:00 to 09:00. Please confirm.
            </p>
          </div>
        </motion.div>

        {/* Bookings */}
        <div className="mt-8">
          <h2 className="font-display text-lg font-bold text-foreground">Upcoming Sessions</h2>
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
                    <span className="text-xs text-muted-foreground">{booking.date.split(" ")[0]}</span>
                    <span className="font-display text-lg font-bold text-foreground">
                      {booking.date.split(" ")[1].replace(",", "")}
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground">{booking.time}</p>
                    <p className="text-sm text-muted-foreground">{booking.trainer}</p>
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

        {/* Course Status */}
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold text-foreground">Course Progress</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">PRO Plan · 20 sessions</span>
              <span className="font-display font-semibold text-primary">14 remaining</span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "30%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground">6 of 20 sessions completed</p>
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
                  <h3 className="mt-4 font-display text-xl font-bold text-foreground">Coach Alex</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Personal Trainer</p>
                  <p className="mt-3 text-sm text-muted-foreground italic">
                    "Hey! Feel free to ask me anything you're curious about — training, nutrition, or just life. I'm here for you! 💪"
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
