import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Monitor,
  MapPin,
  Car,
  ChevronUp,
  ChevronDown,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";

const SLOT_HEIGHT = 48; // px per 30-min slot
const START_HOUR = 7;
const END_HOUR = 20;
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2; // 26 slots
const LUNCH_HOUR = 12;
const LUNCH_BLOCKS = 2; // 1 hour

const hours = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i,
);

// Simulated taken/blocked slots (slotIndex based, 0 = 07:00)
const blockedSlots: Record<
  string,
  { start: number; blocks: number; label: string; trainerId: string }[]
> = {};
// Seed some fake blocked data
const today = new Date();
const todayKey = format(today, "yyyy-MM-dd");
const tomorrowKey = format(addDays(today, 1), "yyyy-MM-dd");
blockedSlots[todayKey] = [
  { start: 4, blocks: 3, label: "John D.", trainerId: "trainer-a" }, // 09:00–10:30
  { start: 16, blocks: 2, label: "Sarah K.", trainerId: "trainer-b" }, // 15:00–16:00
  { start: 18, blocks: 4, label: "Mike T.", trainerId: "trainer-c" }, // 16:00–18:00
];
blockedSlots[tomorrowKey] = [
  { start: 2, blocks: 2, label: "Lisa M.", trainerId: "trainer-a" },
  { start: 8, blocks: 2, label: "Noah C.", trainerId: "trainer-b" },
  { start: 14, blocks: 3, label: "Tom B.", trainerId: "trainer-d" },
];

// Simulated user plans with type
const userPlans = [
  {
    id: "online-basis",
    name: "ONLINE BASIS",
    tokens: 6,
    type: "online" as const,
  },
  {
    id: "online-intermediate",
    name: "ONLINE INTERMEDIATE",
    tokens: 15,
    type: "online" as const,
  },
  {
    id: "online-advanced",
    name: "ONLINE ADVANCED",
    tokens: 9,
    type: "online" as const,
  },
  {
    id: "onsite-basis",
    name: "ONSITE BASIS",
    tokens: 5,
    type: "onsite" as const,
  },
  {
    id: "onsite-intermediate",
    name: "ONSITE INTERMEDIATE",
    tokens: 12,
    type: "onsite" as const,
  },
  {
    id: "onsite-advanced",
    name: "ONSITE ADVANCED",
    tokens: 30,
    type: "onsite" as const,
  },
];

const trainers = [
  { id: "trainer-a", name: "Coach Arin" },
  { id: "trainer-b", name: "Coach Bella" },
  { id: "trainer-c", name: "Coach Kaito" },
  { id: "trainer-d", name: "Coach Nina" },
];

type ViewMode = "day" | "week";

const Booking = () => {
  const [currentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode] = useState<ViewMode>("day");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Booking state: slot index + fixed block count by selected plan
  const [bookingStart, setBookingStart] = useState<number | null>(null);
  const [bookingBlocks, setBookingBlocks] = useState(0);
  const [isDraggingBooking, setIsDraggingBooking] = useState(false);
  const [dragOffsetSlot, setDragOffsetSlot] = useState(0);
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<number | null>(null);
  const [pendingDate, setPendingDate] = useState<Date | null>(null);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(
    trainers[0].id,
  );
  const [isTrainerOpen, setIsTrainerOpen] = useState(false);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [saved, setSaved] = useState(false);

  const timelineRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)),
    [currentWeekStart],
  );

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const blocked = (blockedSlots[dateKey] || []).filter(
    (slot) => !!selectedTrainer && slot.trainerId === selectedTrainer,
  );

  const isSlotBlocked = useCallback(
    (slotIndex: number) => {
      const lunchStart = (LUNCH_HOUR - START_HOUR) * 2;
      const isLunchSlot =
        slotIndex >= lunchStart && slotIndex < lunchStart + LUNCH_BLOCKS;
      if (isLunchSlot) return true;

      return blocked.some(
        (b) => slotIndex >= b.start && slotIndex < b.start + b.blocks,
      );
    },
    [blocked],
  );

  const isSlotConflict = useCallback(
    (start: number, blocks: number) => {
      for (let i = start; i < start + blocks; i++) {
        if (isSlotBlocked(i)) return true;
      }
      return false;
    },
    [isSlotBlocked],
  );

  const getPlanBlocks = useCallback((planId: string) => {
    const plan = userPlans.find((p) => p.id === planId);
    if (!plan) return 0;
    const baseBlocks = plan.name.toLowerCase().includes("basis") ? 2 : 3;
    return plan.type === "onsite" ? baseBlocks + 1 : baseBlocks;
  }, []);

  const getPlanDurationLabel = useCallback(
    (planId: string) => {
      const plan = userPlans.find((p) => p.id === planId);
      if (!plan) return "";
      const totalMinutes = getPlanBlocks(planId) * 30;
      if (plan.type === "onsite") {
        const trainingMinutes = Math.max(totalMinutes - 30, 0);
        return `30m travel + ${trainingMinutes}m`;
      }
      return `${totalMinutes} min`;
    },
    [getPlanBlocks],
  );

  const isSlotBlockedForDate = useCallback(
    (dayDate: Date, slotIndex: number) => {
      const lunchStart = (LUNCH_HOUR - START_HOUR) * 2;
      const isLunchSlot =
        slotIndex >= lunchStart && slotIndex < lunchStart + LUNCH_BLOCKS;
      if (isLunchSlot) return true;

      const key = format(dayDate, "yyyy-MM-dd");
      const dayBlocked = blockedSlots[key] || [];
      return dayBlocked.some(
        (b) =>
          !!selectedTrainer &&
          b.trainerId === selectedTrainer &&
          slotIndex >= b.start &&
          slotIndex < b.start + b.blocks,
      );
    },
    [selectedTrainer],
  );

  const isSlotConflictForDate = useCallback(
    (dayDate: Date, start: number, blocks: number) => {
      for (let i = start; i < start + blocks; i++) {
        if (isSlotBlockedForDate(dayDate, i)) return true;
      }
      return false;
    },
    [isSlotBlockedForDate],
  );

  const getTotalFreeSlotsForDate = useCallback(
    (dayDate: Date) => {
      let freeSlots = 0;
      for (let i = 0; i < TOTAL_SLOTS; i++) {
        if (!isSlotBlockedForDate(dayDate, i)) freeSlots += 1;
      }
      return freeSlots;
    },
    [isSlotBlockedForDate],
  );

  const findValidStartForDate = useCallback(
    (dayDate: Date, preferredStart: number, blocks: number) => {
      const maxStart = TOTAL_SLOTS - blocks;
      if (maxStart < 0) return null;
      const targetStart = Math.max(0, Math.min(preferredStart, maxStart));

      let bestStart: number | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (let start = 0; start <= maxStart; start++) {
        if (isSlotConflictForDate(dayDate, start, blocks)) continue;
        const distance = Math.abs(start - targetStart);

        if (
          distance < bestDistance ||
          (distance === bestDistance && bestStart !== null && start < bestStart)
        ) {
          bestStart = start;
          bestDistance = distance;
        }
      }

      return bestStart;
    },
    [isSlotConflictForDate],
  );

  const slotToTime = (slotIndex: number) => {
    const hour = START_HOUR + Math.floor(slotIndex / 2);
    const min = slotIndex % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${min}`;
  };

  const lunchStartSlot = (LUNCH_HOUR - START_HOUR) * 2;
  const hasLunchWindow =
    lunchStartSlot >= 0 && lunchStartSlot + LUNCH_BLOCKS <= TOTAL_SLOTS;

  const handleTimelineClick = (e: React.MouseEvent, dayDate?: Date) => {
    if (isDraggingBooking) return;
    if (!selectedTrainer) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const slotIndex = Math.floor(y / SLOT_HEIGHT);
    if (slotIndex < 0 || slotIndex >= TOTAL_SLOTS) return;
    const targetDate = dayDate || selectedDate;
    setPendingSlot(slotIndex);
    setPendingDate(targetDate);
    setPendingPlan(selectedPlan);
    setShowPlanPicker(true);
    setIsTrainerOpen(false);
    setSaved(false);
    setShowBookingSummary(false);
  };

  const handlePlanConfirm = () => {
    if (pendingSlot === null || !pendingDate || !pendingPlan) return;
    const planBlocks = getPlanBlocks(pendingPlan);
    const totalFreeSlots = getTotalFreeSlotsForDate(pendingDate);
    if (totalFreeSlots < planBlocks) return;

    const validStart = findValidStartForDate(
      pendingDate,
      pendingSlot,
      planBlocks,
    );
    if (validStart === null) return;

    setSelectedDate(pendingDate);
    setSelectedPlan(pendingPlan);
    setBookingStart(validStart);
    setBookingBlocks(planBlocks);
    setShowPlanPicker(false);
  };

  const closePlanPicker = () => {
    setShowPlanPicker(false);
    setPendingSlot(null);
    setPendingDate(null);
  };

  // Drag handlers for moving booking block only (no resizing)
  useEffect(() => {
    if (!isDraggingBooking) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!gridRef.current || bookingStart === null) return;
      const rect = gridRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const hoveredSlot = Math.max(
        0,
        Math.min(Math.floor(y / SLOT_HEIGHT), TOTAL_SLOTS - 1),
      );
      const maxStart = TOTAL_SLOTS - bookingBlocks;
      const candidateStart = Math.max(
        0,
        Math.min(hoveredSlot - dragOffsetSlot, maxStart),
      );
      if (!isSlotConflict(candidateStart, bookingBlocks)) {
        setBookingStart(candidateStart);
        setSaved(false);
        setShowBookingSummary(false);
      }
    };

    const handlePointerUp = () => {
      setIsDraggingBooking(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    isDraggingBooking,
    bookingStart,
    bookingBlocks,
    dragOffsetSlot,
    isSlotConflict,
  ]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancelBookingSelection = () => {
    setBookingStart(null);
    setBookingBlocks(0);
    setShowBookingSummary(false);
    setSaved(false);
  };

  const moveBookingByDirection = useCallback(
    (direction: "up" | "down") => {
      if (bookingStart === null || bookingBlocks <= 0) return;
      const targetDate = selectedDate;
      const maxStart = TOTAL_SLOTS - bookingBlocks;

      if (direction === "up") {
        for (let start = bookingStart - 1; start >= 0; start--) {
          if (!isSlotConflictForDate(targetDate, start, bookingBlocks)) {
            setBookingStart(start);
            setSaved(false);
            setShowBookingSummary(false);
            return;
          }
        }
      } else {
        for (let start = bookingStart + 1; start <= maxStart; start++) {
          if (!isSlotConflictForDate(targetDate, start, bookingBlocks)) {
            setBookingStart(start);
            setSaved(false);
            setShowBookingSummary(false);
            return;
          }
        }
      }
    },
    [bookingStart, bookingBlocks, selectedDate, isSlotConflictForDate],
  );

  const currentPlan =
    userPlans.find((p) => p.id === selectedPlan) || userPlans[0];
  const currentTrainer = trainers.find(
    (trainer) => trainer.id === selectedTrainer,
  );
  const bookingCost = 1; // 1 booking uses 1 training time
  const planPickerDate = pendingDate || selectedDate;
  const planAvailabilityById = useMemo(() => {
    return userPlans.reduce<Record<string, boolean>>((acc, plan) => {
      const planBlocks = getPlanBlocks(plan.id);
      const totalFreeSlots = getTotalFreeSlotsForDate(planPickerDate);
      acc[plan.id] = totalFreeSlots >= planBlocks;
      return acc;
    }, {});
  }, [getPlanBlocks, getTotalFreeSlotsForDate, planPickerDate]);

  const fitGuideBandsByDate = useMemo(() => {
    const result: Record<string, { start: number; blocks: number }[]> = {};
    const key = format(selectedDate, "yyyy-MM-dd");
    const bands: { start: number; blocks: number }[] = [];
    let segmentStart: number | null = null;

    for (let slot = 0; slot <= TOTAL_SLOTS; slot++) {
      const isBlockedNow =
        slot === TOTAL_SLOTS ? true : isSlotBlockedForDate(selectedDate, slot);

      if (!isBlockedNow && segmentStart === null) {
        segmentStart = slot;
      }

      if (isBlockedNow && segmentStart !== null) {
        const segmentBlocks = slot - segmentStart;
        if (segmentBlocks >= bookingBlocks) {
          bands.push({ start: segmentStart, blocks: segmentBlocks });
        }
        segmentStart = null;
      }
    }

    if (bookingStart === null || bookingBlocks <= 0) {
      result[key] = bands;
      return result;
    }

    const bookingEnd = bookingStart + bookingBlocks;
    const nonOverlappingBands: { start: number; blocks: number }[] = [];

    bands.forEach((band) => {
      const bandStart = band.start;
      const bandEnd = band.start + band.blocks;
      const hasOverlap = bookingStart < bandEnd && bookingEnd > bandStart;

      if (!hasOverlap) {
        nonOverlappingBands.push(band);
        return;
      }

      // Keep free part above the selected booking block.
      if (bandStart < bookingStart) {
        const topBlocks = bookingStart - bandStart;
        if (topBlocks > 0) {
          nonOverlappingBands.push({ start: bandStart, blocks: topBlocks });
        }
      }

      // Keep free part below the selected booking block.
      if (bandEnd > bookingEnd) {
        const bottomBlocks = bandEnd - bookingEnd;
        if (bottomBlocks > 0) {
          nonOverlappingBands.push({ start: bookingEnd, blocks: bottomBlocks });
        }
      }
    });

    result[key] = nonOverlappingBands;
    return result;
  }, [bookingStart, bookingBlocks, selectedDate, isSlotBlockedForDate]);

  const renderTimeline = (dayDate: Date, widthClass: string = "w-full") => {
    const key = format(dayDate, "yyyy-MM-dd");
    const dayBlocked = (blockedSlots[key] || []).filter(
      (slot) => !!selectedTrainer && slot.trainerId === selectedTrainer,
    );
    const isSelectedDay = isSameDay(dayDate, selectedDate);
    const showBooking = isSelectedDay && bookingStart !== null;
    const fitGuideBands = fitGuideBandsByDate[key] || [];

    return (
      <div
        className={`relative ${widthClass}`}
        style={{ height: TOTAL_SLOTS * SLOT_HEIGHT }}
        ref={isSameDay(dayDate, selectedDate) ? gridRef : undefined}
      >
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

        {/* Lunch 1-hour block */}
        {hasLunchWindow && (
          <div
            className="absolute left-1 right-1 rounded-md border border-destructive/50 bg-destructive/20 pointer-events-none z-11"
            style={{
              top: lunchStartSlot * SLOT_HEIGHT + 2,
              height: SLOT_HEIGHT * LUNCH_BLOCKS - 4,
            }}
          >
            <div className="absolute top-1 right-2">
              <span className="rounded bg-destructive/20 px-1.5 py-0.5 text-[9px] font-display font-semibold tracking-wider text-destructive">
                LUNCH (1H)
              </span>
            </div>
          </div>
        )}

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
            <span className="text-[10px] font-medium text-destructive/70 uppercase tracking-wider">
              Booked
            </span>
            <p className="text-xs text-destructive/50 truncate">
              {block.label}
            </p>
          </div>
        ))}

        {/* Available fit guide for continuous usable ranges */}
        {fitGuideBands.map((range, idx) => (
          <div
            key={`fit-${idx}`}
            className="absolute left-1 right-1 rounded-md border border-emerald-500/20 bg-emerald-500/6 pointer-events-none z-9"
            style={{
              top: range.start * SLOT_HEIGHT + 2,
              height: range.blocks * SLOT_HEIGHT - 4,
            }}
          >
            <div className="absolute top-1 right-2">
              <div className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-display font-semibold tracking-wider text-emerald-700 text-right leading-tight">
                <span className="block">Free Time</span>
                <span className="block">Click to booking</span>
              </div>
            </div>
          </div>
        ))}

        {/* User's booking block */}
        {showBooking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute left-1 right-1 rounded-lg border-2 border-primary bg-primary/15 z-25 select-none"
            style={{
              top: bookingStart * SLOT_HEIGHT + 1,
              height: bookingBlocks * SLOT_HEIGHT - 2,
            }}
          >
            {/* Start / End time highlight tags */}
            <div className="absolute -top-2 left-2 z-30">
              <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-display font-semibold text-primary-foreground tracking-wider">
                START {slotToTime(bookingStart)}
              </span>
            </div>
            <div className="absolute -bottom-2 left-2 z-30">
              <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-display font-semibold text-primary-foreground tracking-wider">
                END {slotToTime(bookingStart + bookingBlocks)}
              </span>
            </div>

            {/* Content */}
            <div
              onPointerDown={(e) => {
                if (!gridRef.current || bookingStart === null) return;
                const target = e.target as HTMLElement;
                if (target.closest("[data-arrow-control='true']")) return;
                e.preventDefault();
                e.stopPropagation();
                const rect = gridRef.current.getBoundingClientRect();
                const hoveredSlot = Math.max(
                  0,
                  Math.min(
                    Math.floor((e.clientY - rect.top) / SLOT_HEIGHT),
                    TOTAL_SLOTS - 1,
                  ),
                );
                setDragOffsetSlot(Math.max(0, hoveredSlot - bookingStart));
                setIsDraggingBooking(true);
              }}
              className="flex flex-col items-center justify-center h-full px-2 cursor-grab active:cursor-grabbing touch-none"
            >
              <div className="absolute top-1 right-1 z-20 flex gap-1">
                <button
                  type="button"
                  data-arrow-control="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveBookingByDirection("up");
                  }}
                  disabled={bookingStart <= 0}
                  className="h-6 w-6 rounded-md border border-primary/40 bg-background/90 text-primary flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Move booking up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  data-arrow-control="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveBookingByDirection("down");
                  }}
                  disabled={bookingStart >= TOTAL_SLOTS - bookingBlocks}
                  className="h-6 w-6 rounded-md border border-primary/40 bg-background/90 text-primary flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Move booking down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

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
                {slotToTime(bookingStart)} –{" "}
                {slotToTime(bookingStart + bookingBlocks)}
              </span>
              <span className="text-[10px] text-primary/70 mt-0.5">
                {currentPlan.type === "onsite"
                  ? `${bookingBlocks * 30} min · first 30 min travel`
                  : `${bookingBlocks * 30} min · ${bookingCost} time`}
              </span>
              <span className="text-[9px] text-primary/60 mt-1 uppercase tracking-wider font-medium">
                Drag to move only
              </span>
            </div>
          </motion.div>
        )}

        {/* Click area - below booking block */}
        <div
          className="absolute inset-0 z-1 cursor-pointer"
          onClick={(e) => handleTimelineClick(e, dayDate)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-5xl pt-20 pb-28">
        {/* Date Navigation */}
        <div className="mt-8 flex items-center gap-3"></div>

        {/* Week day selector (only in day view) */}
        {viewMode === "day" && (
          <div className="flex gap-1.5">
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
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    {format(day, "EEE")}
                  </span>
                  <span
                    className={`font-display text-base font-bold ${isSelected ? "text-primary" : "text-foreground"}`}
                  >
                    {format(day, "d")}
                  </span>
                  {isTodayDate && (
                    <div className="h-1 w-1 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-4">
          {/* Timeline */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div
              className="overflow-y-auto max-h-[calc(100vh-300px)] [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
              ref={timelineRef}
            >
              <div className="flex">
                {/* Time labels */}
                <div className="shrink-0 w-20 border-r border-border bg-card">
                  {hours.map((hour) => {
                    const isPM = hour >= 12;
                    const display12 =
                      hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    const isEven = hour % 2 === 0;
                    return (
                      <div
                        key={hour}
                        className="relative"
                        style={{ height: SLOT_HEIGHT * 2 }}
                      >
                        <div className="absolute -top-3 right-3 flex items-baseline gap-0.5">
                          <span
                            className={`font-display font-bold ${isEven ? "text-sm text-foreground" : "text-xs text-muted-foreground"}`}
                          >
                            {display12}:00
                          </span>
                          <span
                            className={`font-display uppercase ${isEven ? "text-[10px] font-semibold text-primary" : "text-[9px] text-muted-foreground"}`}
                          >
                            {isPM ? "PM" : "AM"}
                          </span>
                        </div>
                        {/* Half-hour marker */}
                        <div
                          className="absolute right-3 flex items-baseline gap-0.5"
                          style={{ top: SLOT_HEIGHT - 6 }}
                        >
                          <span className="text-[10px] text-muted-foreground/50 font-display">
                            {display12}:30
                          </span>
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
                      <div
                        key={day.toISOString()}
                        className="flex-1 border-r border-border last:border-r-0 relative"
                      >
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
                              isToday(day)
                                ? "text-primary"
                                : isSameDay(day, selectedDate)
                                  ? "text-primary"
                                  : "text-foreground"
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
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
        <div className="container max-w-5xl py-3">
          <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {bookingStart !== null && (
              <button
                type="button"
                onClick={handleCancelBookingSelection}
                className="absolute -top-1 right-0 h-8 w-8 rounded-full border-2 border-destructive/70 bg-destructive/15 text-destructive hover:bg-destructive/25 hover:scale-105 transition-all shadow-sm flex items-center justify-center"
                aria-label="Cancel selected booking slot"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            )}
            {bookingStart !== null ? (
              <div className="text-sm text-muted-foreground leading-tight">
                <p>
                  <span className="font-display font-semibold text-foreground">
                    {format(selectedDate, "MMM d")}
                  </span>{" "}
                  ·{" "}
                  <span className="font-display font-semibold text-foreground">
                    {slotToTime(bookingStart)} –{" "}
                    {slotToTime(bookingStart + bookingBlocks)}
                  </span>{" "}
                  ·{" "}
                  <span className="font-display font-semibold text-primary">
                    {currentPlan.name}
                  </span>
                </p>
                <p className="mt-1 font-display font-semibold text-foreground">
                  {currentTrainer?.name || "No trainer"}
                </p>
              </div>
            ) : (
              <div className="relative w-full sm:max-w-sm">
                <span className="mb-1 block text-[10px] font-display font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Trainer First
                </span>
                <button
                  type="button"
                  onClick={() => setIsTrainerOpen((prev) => !prev)}
                  className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-left text-sm text-foreground hover:border-primary/30 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-primary" />
                    <span className="font-display font-semibold">
                      {currentTrainer?.name || "Choose Trainer"}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isTrainerOpen ? "Close" : "Select"}
                  </span>
                </button>
                {isTrainerOpen && (
                  <div className="absolute bottom-full mb-2 z-50 w-full rounded-lg border border-border bg-card shadow-lg overflow-hidden">
                    {trainers.map((trainer) => {
                      const isActive = trainer.id === selectedTrainer;
                      return (
                        <button
                          key={trainer.id}
                          type="button"
                          onClick={() => {
                            setSelectedTrainer(trainer.id);
                            setIsTrainerOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-secondary/50"
                          }`}
                        >
                          {trainer.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            <Button
              className="w-full sm:w-auto min-w-44 font-display font-semibold tracking-wide"
              size="lg"
              onClick={() => setShowBookingSummary(true)}
              disabled={
                bookingStart === null || currentPlan.tokens - bookingCost < 0
              }
            >
              CONFIRM TIME
            </Button>
          </div>
        </div>
      </div>

      {showPlanPicker && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-base font-bold text-foreground uppercase tracking-wider">
              Select Plan First
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose plan before placing your booking slot.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="h-3.5 w-3.5 text-primary" />
                  <span className="font-display text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Online
                  </span>
                </div>
                <div className="space-y-2">
                  {userPlans
                    .filter((p) => p.type === "online")
                    .map((plan) => {
                      const isActive = pendingPlan === plan.id;
                      const isDisabled = !planAvailabilityById[plan.id];
                      return (
                        <button
                          key={plan.id}
                          onClick={() => {
                            if (isDisabled) return;
                            setPendingPlan(plan.id);
                          }}
                          disabled={isDisabled}
                          className={`w-full rounded-lg border p-3 text-left transition-all ${
                            isDisabled
                              ? "border-border/60 bg-secondary/20 opacity-50 cursor-not-allowed"
                              : isActive
                                ? "border-primary bg-primary/10"
                                : "border-border bg-secondary/30 hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-display text-xs font-bold tracking-wider ${
                                isDisabled
                                  ? "text-muted-foreground"
                                  : isActive
                                    ? "text-primary"
                                    : "text-foreground"
                              }`}
                            >
                              {plan.name}
                            </span>
                            <div className="text-right">
                              <span className="block text-[10px] text-muted-foreground">
                                {getPlanDurationLabel(plan.id)}
                              </span>
                              {isDisabled && (
                                <span className="block text-[9px] text-destructive">
                                  Not enough free slots
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="font-display text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Onsite
                  </span>
                </div>
                <div className="space-y-2">
                  {userPlans
                    .filter((p) => p.type === "onsite")
                    .map((plan) => {
                      const isActive = pendingPlan === plan.id;
                      const isDisabled = !planAvailabilityById[plan.id];
                      return (
                        <button
                          key={plan.id}
                          onClick={() => {
                            if (isDisabled) return;
                            setPendingPlan(plan.id);
                          }}
                          disabled={isDisabled}
                          className={`w-full rounded-lg border p-3 text-left transition-all ${
                            isDisabled
                              ? "border-border/60 bg-secondary/20 opacity-50 cursor-not-allowed"
                              : isActive
                                ? "border-primary bg-primary/10"
                                : "border-border bg-secondary/30 hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-display text-xs font-bold tracking-wider ${
                                isDisabled
                                  ? "text-muted-foreground"
                                  : isActive
                                    ? "text-primary"
                                    : "text-foreground"
                              }`}
                            >
                              {plan.name}
                            </span>
                            <div className="text-right">
                              <span className="block text-[10px] text-muted-foreground">
                                {getPlanDurationLabel(plan.id)}
                              </span>
                              {isDisabled && (
                                <span className="block text-[9px] text-destructive">
                                  Not enough free slots
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={closePlanPicker}>
                Cancel
              </Button>
              <Button
                onClick={handlePlanConfirm}
                disabled={!pendingPlan || !planAvailabilityById[pendingPlan]}
              >
                Confirm Plan
              </Button>
            </div>
          </div>
        </div>
      )}

      {showBookingSummary && bookingStart !== null && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-xl border border-border bg-card p-5"
          >
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
              Booking Summary
            </h3>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-display font-semibold text-foreground">
                  {format(selectedDate, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="font-display font-semibold text-foreground">
                  {slotToTime(bookingStart)} –{" "}
                  {slotToTime(bookingStart + bookingBlocks)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-display font-semibold text-foreground">
                  {bookingBlocks * 30} min
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-display font-semibold text-primary">
                  {currentPlan.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trainer</span>
                <span className="font-display font-semibold text-foreground">
                  {currentTrainer?.name || "-"}
                </span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time Cost</span>
                <span className="font-display font-bold text-primary flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {bookingCost}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining Times</span>
                <span
                  className={`font-display font-bold ${currentPlan.tokens - bookingCost < 0 ? "text-destructive" : "text-foreground"}`}
                >
                  {currentPlan.tokens - bookingCost}
                </span>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowBookingSummary(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button onClick={handleSave} className="flex-1">
                {saved ? (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> SAVED
                  </span>
                ) : (
                  "SAVE BOOKING"
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Booking;
