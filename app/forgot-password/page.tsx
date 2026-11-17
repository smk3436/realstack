"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Send the reset link to the user's email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Success! Check your email for the password reset link.");
    }
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 relative"
      style={{
        backgroundImage: "url('/login-bg.png')", // Uses the same background as login
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl relative z-10">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Reset Your Password
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {message && (
          <div className={`p-3 mb-4 text-sm rounded border ${message.includes("Error") ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}