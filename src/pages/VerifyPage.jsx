import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, RefreshCw } from "lucide-react";
import {
  useVerifyAccountMutation,
  useResendCodeMutation,
} from "../features/users/usersApiSlice";

const COOLDOWN_SECONDS = 60;

const VerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.email;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef([]);
  const autoSentRef = useRef(false);

  const [verifyAccount, { isLoading }] = useVerifyAccountMutation();
  const [resendCode, { isLoading: isResending }] = useResendCodeMutation();

  /* ----------------------------------
     AUTO RESEND ON PAGE LOAD (ONCE)
  ---------------------------------- */
  useEffect(() => {
    if (!userEmail) return;

    if (!autoSentRef.current) {
      autoSentRef.current = true;

      resendCode({ email: userEmail })
        .unwrap()
        .then(() => {
          setMessage({
            type: "success",
            text: "Verification code sent to your email",
          });
          setCooldown(COOLDOWN_SECONDS);
        })
        .catch(() => {
          setMessage({
            type: "error",
            text: "Failed to send verification code",
          });
        });
    }
  }, [userEmail, resendCode]);

  /* ----------------------------------
     COOLDOWN TIMER
  ---------------------------------- */
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* ----------------------------------
     AUTO VERIFY WHEN ALL DIGITS FILLED
  ---------------------------------- */
  useEffect(() => {
    if (code.every((d) => d !== "")) {
      handleVerify(code.join(""));
    }
  }, [code]);

  if (!userEmail) {
    return (
      <div className="p-4 text-center text-red-500">
        No email provided. Please login again.
      </div>
    );
  }

  /* ----------------------------------
     INPUT HANDLERS
  ---------------------------------- */
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ----------------------------------
     PASTE HANDLER (AUTO VERIFY)
  ---------------------------------- */
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasted)) return;

    setCode(pasted.split(""));
  };

  /* ----------------------------------
     VERIFY
  ---------------------------------- */
  const handleVerify = async (fullCode) => {
    try {
      await verifyAccount({ email: userEmail, code: fullCode }).unwrap();
      setMessage({
        type: "success",
        text: "Account verified successfully! Redirecting...",
      });

      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.data?.message || "Verification failed",
      });
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  /* ----------------------------------
     RESEND
  ---------------------------------- */
  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      await resendCode({ email: userEmail }).unwrap();
      setMessage({
        type: "success",
        text: "New verification code sent",
      });
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.data?.message || "Resend failed",
      });
    }
  };

  const allFilled = code.every((d) => d !== "");

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2 text-center">
        Verify Your Account
      </h1>

      <p className="text-gray-500 mb-6 text-center">
        Enter the 6-digit code sent to your email
      </p>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded text-center ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div
        className="flex justify-between gap-2 mb-6 relative"
        onPaste={handlePaste}
      >
        {code.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-12 h-12 text-center text-lg border rounded-md focus:ring focus:ring-blue-200"
          />
        ))}

        {allFilled && (
          <Check className="absolute -top-4 right-0 text-green-500 animate-bounce" />
        )}
      </div>

      <button
        disabled={isLoading || !allFilled}
        className="w-full py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>

      <div className="mt-4 text-center">
        <button
          onClick={handleResend}
          disabled={isResending || cooldown > 0}
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-500 disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          {cooldown > 0
            ? `Resend in ${cooldown}s`
            : isResending
            ? "Resending..."
            : "Resend Code"}
        </button>
      </div>
    </div>
  );
};

export default VerifyPage;
