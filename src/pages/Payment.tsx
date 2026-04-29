import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CheckCircle,
  Clock3,
  QrCode,
  Upload,
  XCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

type TransactionStatus = "success" | "pending" | "cancelled";

type TransactionItem = {
  id: string;
  planTitle: string;
  duration: string;
  pricePerSession: number;
  sessions: number;
  total: number;
  healthNote?: string;
  status: TransactionStatus;
  createdAt: string;
};

type PaymentFlowStep = "details" | "confirm" | "upload" | "done";

const mockTransactionJson: TransactionItem[] = [
  {
    id: "TRX-20260429-0905",
    planTitle: "ONSITE ADVANCED",
    duration: "1 time training · 1 hour 30 mins",
    pricePerSession: 12000,
    sessions: 1,
    total: 12000,
    healthNote: "",
    status: "success",
    createdAt: "2026-04-29T09:05:00.000Z",
  },
  {
    id: "TRX-20260428-1410",
    planTitle: "ONLINE INTERMEDIATE",
    duration: "1 time training · 1 hour 30 mins",
    pricePerSession: 5500,
    sessions: 2,
    total: 11000,
    healthNote: "Left shoulder tightness.",
    status: "pending",
    createdAt: "2026-04-28T14:10:00.000Z",
  },
  {
    id: "TRX-20260426-0820",
    planTitle: "ONLINE BASIS",
    duration: "1 time training · 1 hour",
    pricePerSession: 2500,
    sessions: 1,
    total: 2500,
    healthNote: "",
    status: "cancelled",
    createdAt: "2026-04-26T08:20:00.000Z",
  },
];

const statusClasses: Record<TransactionStatus, string> = {
  success: "border-primary/30 bg-primary/10 text-primary",
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
};

const statusLabel: Record<TransactionStatus, string> = {
  success: "Success",
  pending: "Pending",
  cancelled: "Cancelled",
};

const statusIcon: Record<TransactionStatus, ReactNode> = {
  success: <CheckCircle className="h-4 w-4" />,
  pending: <Clock3 className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    openPaymentFlow?: boolean;
  } | null;

  const sortedTransactions = useMemo(
    () =>
      [...mockTransactionJson].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [],
  );

  const [transactions, setTransactions] =
    useState<TransactionItem[]>(sortedTransactions);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionItem | null>(() =>
      state?.openPaymentFlow ? (sortedTransactions[0] ?? null) : null,
    );
  const [flowStep, setFlowStep] = useState<PaymentFlowStep>("details");
  const [file, setFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const openTransaction = (item: TransactionItem) => {
    setSelectedTransaction(item);
    setFlowStep("details");
    setFile(null);
    setAgreed(false);
    setShowAgreement(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-5xl pt-28 pb-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Payment Transactions
              </h1>
            </div>
            <Button variant="secondary" onClick={() => navigate("/plans")}>
              Back to Plans
            </Button>
          </div>

          <div className="grid gap-6">
            <div className="space-y-3">
              {transactions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openTransaction(item)}
                  className="w-full rounded-lg border border-border bg-background/30 p-4 text-left transition-colors hover:border-primary/40 hover:bg-background/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-foreground">
                      {item.planTitle}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${statusClasses[item.status]}`}
                    >
                      {statusIcon[item.status]}
                      {statusLabel[item.status]}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{item.id}</span>
                    <span>฿{item.total.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-lg rounded-lg border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">
                Payment Process
              </h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            {flowStep === "details" && (
              <>
                <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Step 1: Transaction Details
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="text-right font-medium text-foreground">
                      {selectedTransaction.planTitle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-right font-medium text-foreground">
                      {selectedTransaction.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Sessions</span>
                    <span className="text-right font-medium text-foreground">
                      {selectedTransaction.sessions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-display text-lg font-semibold text-primary">
                      ฿{selectedTransaction.total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => setFlowStep("confirm")}
                  className="mt-6 w-full"
                  size="lg"
                >
                  Continue
                </Button>
              </>
            )}

            {flowStep === "confirm" && (
              <>
                <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Step 2: Confirm Payment
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Please confirm to proceed with QR payment for transaction{" "}
                  <span className="font-medium text-foreground">
                    {selectedTransaction.id}
                  </span>
                  .
                </p>
                <button
                  onClick={() => setShowAgreement((prev) => !prev)}
                  className="mt-4 text-sm font-medium text-primary underline underline-offset-4"
                >
                  {showAgreement
                    ? "Hide agreement details"
                    : "View agreement details"}
                </button>
                {showAgreement && (
                  <div className="mt-3 rounded-lg border border-border bg-background/40 p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      Course Payment Agreement (Draft)
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>
                        Payment confirms your booking for this selected plan.
                      </li>
                      <li>
                        Sessions must be used within the package validity
                        period.
                      </li>
                      <li>
                        Reschedule and cancellation requests must follow coach
                        policy time windows.
                      </li>
                      <li>
                        No refund after successful payment, except service-side
                        failure.
                      </li>
                      <li>
                        You are responsible for your health condition disclosure
                        before training.
                      </li>
                    </ul>
                  </div>
                )}
                <label className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                  />
                  <span>
                    I agree to the course payment terms and understand the
                    policy details.
                  </span>
                </label>
                <Button
                  onClick={() => setFlowStep("upload")}
                  disabled={!agreed}
                  className="mt-6 w-full"
                  size="lg"
                >
                  Confirm Payment
                </Button>
              </>
            )}

            {flowStep === "upload" && (
              <>
                <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Step 3: QR & Upload Slip
                </p>
                <div className="mt-4 rounded-lg border border-border bg-background/40 p-6 text-center">
                  <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-lg border border-border bg-secondary">
                    <QrCode className="h-24 w-24 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    PromptPay QR mockup
                  </p>
                </div>
                <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/40">
                  {file ? (
                    <>
                      <CheckCircle className="h-7 w-7 text-primary" />
                      <span className="text-sm text-foreground">
                        {file.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-7 w-7 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Upload payment slip
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUpload}
                  />
                </label>
                <Button
                  onClick={() => {
                    setTransactions((prev) =>
                      prev.map((item) =>
                        item.id === selectedTransaction.id
                          ? { ...item, status: "success" }
                          : item,
                      ),
                    );
                    setSelectedTransaction((prev) =>
                      prev ? { ...prev, status: "success" } : prev,
                    );
                    setFlowStep("done");
                  }}
                  disabled={!file}
                  className="mt-4 w-full"
                  size="lg"
                >
                  Complete
                </Button>
              </>
            )}

            {flowStep === "done" && (
              <>
                <div className="flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="font-display font-semibold text-primary">
                    Payment Completed (Visual)
                  </span>
                </div>
                <Button
                  onClick={() => setSelectedTransaction(null)}
                  className="mt-4 w-full"
                  size="lg"
                >
                  Back to Transactions
                </Button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Payment;
