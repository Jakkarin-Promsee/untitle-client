import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    title: string;
    price: number;
    duration: string;
  } | null;
}

const TransactionModal = ({ isOpen, onClose, course }: TransactionModalProps) => {
  const [sessions, setSessions] = useState(1);
  const [healthNote, setHealthNote] = useState("");
  const navigate = useNavigate();

  if (!course) return null;

  const total = course.price * sessions;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md rounded-lg border border-border bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">Order Summary</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-md border border-border bg-secondary/50 p-4">
              <p className="font-display font-semibold text-foreground">{course.title}</p>
              <p className="text-sm text-muted-foreground">{course.duration}</p>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-muted-foreground">Number of Packages</label>
              <div className="mt-2 flex items-center gap-4">
                <button
                  onClick={() => setSessions(Math.max(1, sessions - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary text-foreground hover:bg-surface-hover transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-display text-2xl font-bold text-foreground w-12 text-center">{sessions}</span>
                <button
                  onClick={() => setSessions(sessions + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary text-foreground hover:bg-surface-hover transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Allergies / Injuries (Required)
              </label>
              <Textarea
                value={healthNote}
                onChange={(e) => setHealthNote(e.target.value)}
                placeholder="List any allergic reactions, injuries, or medical conditions..."
                className="mt-2 min-h-[80px] border-border bg-secondary/50 text-foreground placeholder:text-text-dim"
              />
            </div>

            <div className="mt-6 flex items-center justify-between rounded-md border border-border bg-secondary/50 p-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl font-bold text-primary">฿{total.toLocaleString()}</span>
            </div>

            <Button
              onClick={() => {
                onClose();
                navigate("/payment", { state: { course, sessions, total, healthNote } });
              }}
              disabled={!healthNote.trim()}
              className="mt-4 w-full font-display font-semibold tracking-wide"
              size="lg"
            >
              PROCEED TO PAYMENT
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
