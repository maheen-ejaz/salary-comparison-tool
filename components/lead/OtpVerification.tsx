"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";

interface Props {
  phone: string; // 10-digit phone number
  onVerified: () => void;
  onBack: () => void;
}

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 30;

function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return `${phone.slice(0, 2)}****${phone.slice(-4)}`;
}

export function OtpVerification({ phone, onVerified, onBack }: Props) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [resendCount, setResendCount] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");

    // Auto-advance to next input
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    // Focus the input after the last pasted digit
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = useCallback(async () => {
    const otpString = otp.join("");
    if (otpString.length !== OTP_LENGTH) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpString }),
      });

      const data = await res.json();

      if (data.verified) {
        onVerified();
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }, [otp, phone, onVerified]);

  // Auto-submit when all digits are filled
  useEffect(() => {
    if (otp.every((d) => d !== "") && !isVerifying) {
      handleVerify();
    }
  }, [otp, isVerifying, handleVerify]);

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setError("");

    try {
      const res = await fetch("/api/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok) {
        setCountdown(COUNTDOWN_SECONDS);
        setResendCount((prev) => prev + 1);
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        setError(data.error || "Failed to resend OTP.");
      }
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--neutral-50)" }}>
      <div className="max-w-lg mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--primary-900)" }}>
          Verify your mobile number
        </h1>
        <p className="mb-2" style={{ color: "var(--neutral-600)" }}>
          We&apos;ve sent a 6-digit OTP to
        </p>
        <p className="mb-8 text-lg font-semibold" style={{ color: "var(--primary-700)" }}>
          +91 {maskPhone(phone)}
        </p>

        <div
          className="rounded-2xl p-8 space-y-6 backdrop-blur-xl"
          style={{
            background: "rgba(255, 255, 255, 0.5)",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
          }}
        >
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: "var(--neutral-700)" }}>
              Enter OTP
            </label>
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-semibold rounded-lg outline-none transition-all"
                  style={{
                    border: `1.5px solid ${error ? "var(--error-600)" : digit ? "var(--primary-500)" : "var(--neutral-200)"}`,
                    background: "rgba(255, 255, 255, 0.6)",
                    color: "var(--neutral-900)",
                  }}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-center" style={{ color: "var(--error-600)" }}>
              {error}
            </p>
          )}

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying || otp.some((d) => d === "")}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: "var(--primary-700)" }}
          >
            {isVerifying ? "Verifying..." : (
              <>
                Verify & Continue
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Resend and Change number */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: "var(--neutral-500)" }}
            >
              <ArrowLeft size={14} />
              Change number
            </button>

            {resendCount < 2 ? (
              <button
                onClick={handleResend}
                disabled={countdown > 0 || isResending}
                className="flex items-center gap-1 text-sm font-medium transition-opacity disabled:opacity-40"
                style={{ color: countdown > 0 ? "var(--neutral-400)" : "var(--primary-600)" }}
              >
                <RefreshCw size={14} />
                {isResending
                  ? "Sending..."
                  : countdown > 0
                    ? `Resend in ${countdown}s`
                    : "Resend OTP"}
              </button>
            ) : (
              <span className="text-xs" style={{ color: "var(--neutral-400)" }}>
                Max resends reached
              </span>
            )}
          </div>

          <p className="text-xs text-center" style={{ color: "var(--neutral-400)" }}>
            OTP is valid for 5 minutes. Check your SMS inbox.
          </p>
        </div>
      </div>
    </main>
  );
}
