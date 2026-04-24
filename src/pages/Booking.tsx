import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon, Zap, Monitor, MapPin, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";

const SLOT_HEIGHT = 48; // px per 30-min slot
const START_HOUR = 7;
const END_HOUR = 20;
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2; // 26 slots
const MIN_BLOCKS = 2; // minimum 1 hour (2 × 30 min)
const MAX_BLOCKS = 6; // maximum 3 hours

const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

// Simulated taken/blocked slots (slotIndex based, 0 = 07:00)
const blockedSlots: Record<string, { start: number; blocks: number; label: string }[]> = {};
// Seed some fake blocked data
const today = new Date();
const todayKey = format(today, "yyyy-MM-dd");
const tomorrowKey = format(addDays(today, 1), "yyyy-MM-dd");
blockedSlots[todayKey] = [
  { start: 4, blocks: 3, label: "John D." },   // 09:00–10:30
  { start: 10, blocks: 2, label: "Sarah K." },  // 12:00–13:00
  { start: 18, blocks: 4, label: "Mike T." },   // 16:00–18:00
];
blockedSlots[tomorrowKey] = [
  { start: 2, blocks: 2, label: "Lisa M." },
  { start: 14, blocks: 3, label: "Tom B." },
];

// Simulated user plans with type
const userPlans = [
  { id: "online-starter", name: "ONLINE STARTER", tokens: 6, totalTokens: 8, type: "online" as const },
  { id: "online-pro", name: "ONLINE PRO", tokens: 15, totalTokens: 20, type: "online" as const },
  { id: "onsite-starter", name: "ONSITE STARTER", tokens: 5, totalTokens: 8, type: "onsite" as const },
  { id: "onsite-pro", name: "ONSITE PRO", tokens: 12, totalTokens: 20, type: "onsite" as const },
  { id: "onsite-elite", name: "ONSITE ELITE", tokens: 30, totalTokens: 40, type: "onsite" as const },
];

type ViewMode = "day" | "week";

const Booking = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedPlan, setSelectedPlan] = useState(userPlans[3].id);

  // Booking state: slot index + block count
  const [bookingStart, setBookingStart] = useState<number | null>(null);
  const [bookingBlocks, setBookingBlocks] = useState(MIN_BLOCKS);
  const [isDraggingTop, setIsDraggingTop] = useState(false);
  const [isDraggingBottom, setIsDraggingBottom] = useState(false);
  const [saved, setSaved] = useState(false);

  const timelineRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)),
    [currentWeekStart]
  );

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const blocked = blockedSlots[dateKey] || [];

  const isSlotBlocked = useCallback(
    (slotIndex: number) => {
      return blocked.some(
        (b) => slotIndex >= b.start && slotIndex < b.start + b.blocks
      );
    },
    [blocked]
  );

  const isSlotConflict = useCallback(
    (start: number, blocks: number) => {
      for (let i = start; i < start + blocks; i++) {
        if (isSlotBlocked(i)) return true;
      }
      return false;
    },
    [isSlotBlocked]
  );

  const slotToTime = (slotIndex: number) => {
    const hour = START_HOUR + Math.floor(slotIndex / 2);
    const min = slotIndex % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${min}`;
  };

  const handleTimelineClick = (e: React.MouseEvent, dayDate?: Date) => {
    if (isDraggingTop || isDraggingBottom) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const slotIndex = Math.floor(y / SLOT_HEIGHT);
    if (slotIndex < 0 || slotIndex >= TOTAL_SLOTS) return;

    // Check if this slot or default range is blocked
    const defaultBlocks = MIN_BLOCKS;
    const endSlot = Math.min(slotIndex + defaultBlocks, TOTAL_SLOTS);
    if (isSlotConflict(slotIndex, endSlot - slotIndex)) return;

    if (dayDate) setSelectedDate(dayDate);
    setBookingStart(slotIndex);
    setBookingBlocks(Math.min(defaultBlocks, TOTAL_SLOTS - slotIndex));
    setSaved(false);
  };

  // Drag handlers for resizing
  useEffect(() => {
    if (!isDraggingTop && !isDraggingBottom) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current || bookingStart === null) return;
      const rect = gridRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const slotIndex = Math.max(0, Math.min(Math.floor(y / SLOT_HEIGHT), TOTAL_SLOTS - 1));

      if (isDraggingTop) {
        const newStart = Math.min(slotIndex, bookingStart + bookingBlocks - MIN_BLOCKS);
        const newBlocks = bookingStart + bookingBlocks - newStart;
        if (newBlocks >= MIN_BLOCKS && newBlocks <= MAX_BLOCKS && !isSlotConflict(newStart, newBlocks)) {
          setBookingStart(newStart);
          setBookingBlocks(newBlocks);
        }
      } else if (isDraggingBottom) {
        const newBlocks = Math.max(MIN_BLOCKS, Math.min(slotIndex - bookingStart + 1, MAX_BLOCKS, TOTAL_SLOTS - bookingStart));
        if (!isSlotConflict(bookingStart, newBlocks)) {
          setBookingBlocks(newBlocks);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingTop(false);
      setIsDraggingBottom(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingTop, isDraggingBottom, bookingStart, bookingBlocks, isSlotConflict]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const currentPlan = userPlans.find((p) => p.id === selectedPlan)!;
  const bookingCost = bookingBlocks; // 1 token per 30-min block

  const renderTimeline = (dayDate: Date, widthClass: string = "w-full") => {
    const key = format(dayDate, "yyyy-MM-dd");
    const dayBlocked = blockedSlots[key] || [];
    const isSelectedDay = isSameDay(dayDate, selectedDate);
    const showBooking = isSelectedDay && bookingStart !== null;

    return (
      <div className={`relative ${widthClass}`} style={{ height: TOTAL_SLOTS * SLOT_HEIGHT }} ref={isSameDay(dayDate, selectedDate) ? gridRef : undefined}>
        {/* Grid lines */}
        {Array.from({ length: TOTAL_SLOTS }, (_, i) => (
          <div
            key={i}
            className={`absolute left-0 right-0 border-b ${
              i % 2 === 0 ? "border-border" : "border-border/40"
            }`}
            style={{ top: i * SLOT_HEIGHT, height: SLOT_HEIGHT }}
          />
        ))}

        {/* Blocked slots */}
        {dayBlocked.map((block, idx) => (
          <div
            key={idx}
            className="absolute left-1 right-1 rounded-md bg-destructive/15 border border-destructive/30 px-2 py-1 pointer-events-none z-10"
            style={{
              top: block.start * SLOT_HEIGHT + 2,
              height: block.blocks * SLOT_HEIGHT - 4,
            }}
          >
            <span className="text-[10px] font-medium text-destructive/70 uppercase tracking-wider">Booked</span>
            <p className="text-xs text-destructive/50 truncate">{block.label}</p>
          </div>
        ))}

        {/* User's booking block */}
        {showBooking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute left-1 right-1 rounded-lg border-2 border-primary bg-primary/15 z-[25] select-none"
            style={{
              top: bookingStart * SLOT_HEIGHT + 1,
              height: bookingBlocks * SLOT_HEIGHT - 2,
            }}
          >
            {/* Top drag handle */}
            <div
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTop(true); }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-5 rounded-full bg-primary cursor-ns-resize hover:bg-primary/80 hover:scale-110 transition-all z-[35]"
              style={{ position: 'absolute' }}
            >
              <div className="w-6 h-[2px] rounded-full bg-primary-foreground" />
            </div>

            {/* Content */}
            <div className="flex flex-col items-center justify-center h-full px-2">
              {/* Trainer travel highlight for onsite */}
              {currentPlan.type === "onsite" && bookingBlocks >= 1 && (
                <div
                  className="absolute top-0 left-0 right-0 rounded-t-lg bg-accent/20 border-b border-dashed border-accent/40 flex items-center justify-center gap-1.5 z-10"
                  style={{ height: Math.min(1, bookingBlocks) * SLOT_HEIGHT }}
                >
                  <Car className="h-3 w-3 text-accent" />
                  <span className="font-display text-[9px] font-bold uppercase tracking-wider text-accent">
                    Trainer Traveling
                  </span>
                </div>
              )}
              <span className="font-display text-xs font-bold text-primary tracking-wider">
                {slotToTime(bookingStart)} – {slotToTime(bookingStart + bookingBlocks)}
              </span>
              <span className="text-[10px] text-primary/70 mt-0.5">
                {currentPlan.type === "onsite"
                  ? `${bookingBlocks * 30} min · first 30 min travel`
                  : `${bookingBlocks * 30} min · ${bookingCost} tokens`
                }
              </span>
            </div>

            {/* Bottom drag handle */}
            <div
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingBottom(true); }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-5 rounded-full bg-primary cursor-ns-resize hover:bg-primary/80 hover:scale-110 transition-all z-[35]"
              style={{ position: 'absolute' }}
            >
              <div className="w-6 h-[2px] rounded-full bg-primary-foreground" />
            </div>
          </motion.div>
        )}

        {/* Click area - below booking block */}
        <div
          className="absolute inset-0 z-[1] cursor-pointer"
          onClick={(e) => handleTimelineClick(e, dayDate)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-primary">Schedule</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Book Your Session</h1>
          </div>
          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setViewMode("day")}
              className={`rounded-md px-4 py-2 text-sm font-display font-semibold transition-all ${
                viewMode === "day" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              DAY
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`rounded-md px-4 py-2 text-sm font-display font-semibold transition-all ${
                viewMode === "week" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              WEEK
            </button>
          </div>
        </motion.div>

        {/* Date Navigation */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => {
              if (viewMode === "week") setCurrentWeekStart(addDays(currentWeekStart, -7));
              else setSelectedDate(addDays(selectedDate, -1));
            }}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-surface-hover transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={() => { setSelectedDate(new Date()); setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 })); }}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-display font-semibold text-foreground hover:bg-surface-hover transition-colors flex items-center gap-2"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            TODAY
          </button>

          <h2 className="font-display text-lg font-bold text-foreground">
            {viewMode === "day"
              ? format(selectedDate, "EEEE, MMMM d, yyyy")
              : `${format(currentWeekStart, "MMM d")} – ${format(addDays(currentWeekStart, 6), "MMM d, yyyy")}`}
          </h2>

          <button
            onClick={() => {
              if (viewMode === "week") setCurrentWeekStart(addDays(currentWeekStart, 7));
              else setSelectedDate(addDays(selectedDate, 1));
            }}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-surface-hover transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Week day selector (only in day view) */}
        {viewMode === "day" && (
          <div className="mt-4 flex gap-1.5">
            {weekDays.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg border p-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wider">{format(day, "EEE")}</span>
                  <span className={`font-display text-base font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {format(day, "d")}
                  </span>
                  {isTodayDate && <div className="h-1 w-1 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Timeline */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="overflow-y-auto max-h-[calc(100vh-300px)]" ref={timelineRef}>
              <div className="flex">
                {/* Time labels */}
                <div className="flex-shrink-0 w-20 border-r border-border bg-card">
                  {hours.map((hour) => {
                    const isPM = hour >= 12;
                    const display12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    const isEven = hour % 2 === 0;
                    return (
                      <div key={hour} className="relative" style={{ height: SLOT_HEIGHT * 2 }}>
                        <div className="absolute -top-3 right-3 flex items-baseline gap-0.5">
                          <span className={`font-display font-bold ${isEven ? "text-sm text-foreground" : "text-xs text-muted-foreground"}`}>
                            {display12}:00
                          </span>
                          <span className={`font-display uppercase ${isEven ? "text-[10px] font-semibold text-primary" : "text-[9px] text-muted-foreground"}`}>
                            {isPM ? "PM" : "AM"}
                          </span>
                        </div>
                        {/* Half-hour marker */}
                        <div className="absolute right-3 flex items-baseline gap-0.5" style={{ top: SLOT_HEIGHT - 6 }}>
                          <span className="text-[10px] text-muted-foreground/50 font-display">{display12}:30</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Timeline columns */}
                {viewMode === "day" ? (
                  <div className="flex-1 relative">
                    {renderTimeline(selectedDate)}
                  </div>
                ) : (
                  <div className="flex-1 flex">
                    {weekDays.map((day) => (
                      <div key={day.toISOString()} className="flex-1 border-r border-border last:border-r-0 relative">
                        {/* Day header */}
                        <div
                          className={`sticky top-0 z-30 border-b px-1 py-2 text-center cursor-pointer transition-colors ${
                            isSameDay(day, selectedDate)
                              ? "bg-primary/10 border-primary/30"
                              : "bg-card border-border hover:bg-surface-hover"
                          }`}
                          onClick={() => setSelectedDate(day)}
                        >
                          <span className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider block">
                            {format(day, "EEE")}
                          </span>
                          <span
                            className={`font-display text-sm font-bold ${
                              isToday(day) ? "text-primary" : isSameDay(day, selectedDate) ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {format(day, "d")}
                          </span>
                        </div>
                        {renderTimeline(day)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Plan Details */}
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">Your Plans</h3>
              
              {/* Online Plans */}
              {userPlans.filter(p => p.type === "online").length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="h-3.5 w-3.5 text-primary" />
                    <span className="font-display text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Online</span>
                  </div>
                  <div className="space-y-2">
                    {userPlans.filter(p => p.type === "online").map((plan) => {
                      const isActive = selectedPlan === plan.id;
                      const pct = (plan.tokens / plan.totalTokens) * 100;
                      return (
                        <button
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`w-full rounded-lg border p-3 text-left transition-all ${
                            isActive
                              ? "border-primary bg-primary/10"
                              : "border-border bg-secondary/30 hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-display text-xs font-bold tracking-wider ${isActive ? "text-primary" : "text-foreground"}`}>
                              {plan.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <Zap className={`h-3 w-3 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                              <span className={`font-display text-sm font-bold ${isActive ? "text-primary" : "text-foreground"}`}>
                                {plan.tokens}
                              </span>
                              <span className="text-[10px] text-muted-foreground">/ {plan.totalTokens}</span>
                            </div>
                          </div>
                          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isActive ? "bg-primary" : "bg-muted-foreground/40"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Onsite Plans */}
              {userPlans.filter(p => p.type === "onsite").length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span className="font-display text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Onsite</span>
                  </div>
                  <div className="space-y-2">
                    {userPlans.filter(p => p.type === "onsite").map((plan) => {
                      const isActive = selectedPlan === plan.id;
                      const pct = (plan.tokens / plan.totalTokens) * 100;
                      return (
                        <button
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`w-full rounded-lg border p-3 text-left transition-all ${
                            isActive
                              ? "border-primary bg-primary/10"
                              : "border-border bg-secondary/30 hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-display text-xs font-bold tracking-wider ${isActive ? "text-primary" : "text-foreground"}`}>
                              {plan.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <Zap className={`h-3 w-3 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                              <span className={`font-display text-sm font-bold ${isActive ? "text-primary" : "text-foreground"}`}>
                                {plan.tokens}
                              </span>
                              <span className="text-[10px] text-muted-foreground">/ {plan.totalTokens}</span>
                            </div>
                          </div>
                          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isActive ? "bg-primary" : "bg-muted-foreground/40"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Booking summary */}
            {bookingStart !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-border bg-card p-5"
              >
                <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">Booking Summary</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-display font-semibold text-foreground">{format(selectedDate, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-display font-semibold text-foreground">
                      {slotToTime(bookingStart)} – {slotToTime(bookingStart + bookingBlocks)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-display font-semibold text-foreground">{bookingBlocks * 30} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-display font-semibold text-primary">{currentPlan.name}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Token Cost</span>
                    <span className="font-display font-bold text-primary flex items-center gap-1">
                      <Zap className="h-3 w-3" /> {bookingCost}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className={`font-display font-bold ${currentPlan.tokens - bookingCost < 0 ? "text-destructive" : "text-foreground"}`}>
                      {currentPlan.tokens - bookingCost}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <Button
              onClick={handleSave}
              disabled={bookingStart === null || currentPlan.tokens - bookingCost < 0}
              className="w-full font-display font-semibold tracking-wide"
              size="lg"
            >
              {saved ? (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" /> SAVED
                </span>
              ) : (
                "SAVE BOOKING"
              )}
            </Button>
            <Button
              variant="outline"
              disabled={bookingStart === null}
              className="w-full font-display font-semibold tracking-wide border-border text-foreground hover:bg-secondary"
              size="lg"
            >
              VERIFY CREDITS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
