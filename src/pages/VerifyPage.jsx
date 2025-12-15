import { useVerifyAccountMutation, useResendCodeMutation } from "../features/users/usersApiSlice";
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, X, RefreshCw } from "lucide-react";

const VerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.email;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [verifyAccount, { isLoading }] = useVerifyAccountMutation();
  const [resendCode, { isLoading: isResending }] = useResendCodeMutation();

  const [message, setMessage] = useState({ type: "", text: "" }); // { type: 'success' | 'error', text: string }

  if (!userEmail) {
    return (
      <div className="p-4 text-center text-red-500">
        No email provided. Please go back and register first.
      </div>
    );
  }

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return;
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);
    if (val && index < inputRefs.current.length - 1) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (code.every((c) => c !== "")) handleSubmit();
  }, [code]);

  const handleSubmit = async () => {
    const fullCode = code.join("");
    try {
      await verifyAccount({ email: userEmail, code: fullCode }).unwrap();
      setMessage({ type: "success", text: "Account verified successfully! Redirecting..." });
      setTimeout(() => navigate("/login"), 2000); // 2s delay before redirect
    } catch (err) {
      setMessage({ type: "error", text: err?.data?.message || "Verification failed" });
    }
  };

  const handleResend = async () => {
    try {
      await resendCode({ email: userEmail }).unwrap();
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
      setMessage({ type: "success", text: "Verification code resent successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err?.data?.message || "Resend failed" });
    }
  };

  const allFilled = code.every((c) => c !== "");

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md relative">
      <h1 className="text-2xl font-bold mb-4 text-center">Verify Your Account</h1>
      <p className="text-gray-500 mb-6 text-center">Enter the 6-digit code sent to your email</p>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          } text-center`}
        >
          {message.text}
        </div>
      )}

      <div className="flex justify-between gap-2 mb-4 relative">
        {code.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-12 h-12 text-center text-lg border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        ))}

        {allFilled && <Check className="absolute top-0 right-0 w-6 h-6 text-green-500 animate-bounce" />}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || !allFilled}
        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>

      <div className="mt-4 text-center">
        <button
          onClick={handleResend}
          disabled={isResending}
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-500 transition"
        >
          <RefreshCw className="w-4 h-4" />
          {isResending ? "Resending..." : "Resend Code"}
        </button>
      </div>
    </div>
  );
};

export default VerifyPage;
