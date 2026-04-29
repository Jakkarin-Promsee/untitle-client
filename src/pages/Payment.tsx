import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, QrCode } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    course?: { title: string; duration: string; price: number };
    sessions?: number;
    healthNote?: string;
    total?: number;
  } | null;
  const [file, setFile] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleVerify = () => {
    setVerifying(true);
    // Simulate bot verification
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      setTimeout(() => navigate("/booking"), 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container flex min-h-screen items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            {state?.course && (
              <p className="mt-8 text-muted-foreground">
                {state.course.title} ·{" "}
                <span className="text-primary font-semibold">
                  ฿{state.total?.toLocaleString()}
                </span>
              </p>
            )}
          </div>

          {state?.course && (
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Order Details
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="text-right font-medium text-foreground">
                    {state.course.title}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Training time</span>
                  <span className="text-right font-medium text-foreground">
                    {state.course.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Price per time</span>
                  <span className="text-right font-medium text-foreground">
                    ฿{state.course.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="text-right font-medium text-foreground">
                    {state.sessions ?? 1}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-foreground">Total</span>
                  <span className="font-display text-lg font-semibold text-primary">
                    ฿{state.total?.toLocaleString() ?? "0"}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="space-y-1">
                  <p className="text-muted-foreground">Allergies / Injuries</p>
                  <p className="text-foreground">
                    {state.healthNote?.trim() || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* QR Code */}
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-lg border border-border bg-secondary">
              <QrCode className="h-32 w-32 text-muted-foreground" />
            </div>
            <p className="mt-4 font-display text-sm font-semibold text-foreground">
              PromptPay QR Code
            </p>
            <p className="text-xs text-muted-foreground">
              Scan with your banking app
            </p>
          </div>

          {/* Upload */}
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="font-display text-sm font-semibold text-foreground">
              Upload Payment Slip
            </p>
            <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/40">
              {file ? (
                <>
                  <CheckCircle className="h-8 w-8 text-primary" />
                  <span className="text-sm text-foreground">{file.name}</span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload slip
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
          </div>

          {verified ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-4"
            >
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-display font-semibold text-primary">
                Payment Verified! Redirecting...
              </span>
            </motion.div>
          ) : (
            <Button
              onClick={handleVerify}
              disabled={!file || verifying}
              className="w-full font-display font-semibold tracking-wide"
              size="lg"
            >
              {verifying ? "VERIFYING..." : "SUBMIT & VERIFY"}
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
