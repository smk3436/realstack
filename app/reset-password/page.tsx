"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Supabase automatically logs the user in when they click the reset link
    // We verify that they actually have a valid session here
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      } else {
        setMessage("Invalid or expired reset link. Please request a new one.");
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }
    
    setLoading(true);
    setMessage("");

    // Update the user's password
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Success! Your password has been updated. Redirecting to login...");
      // Sign them out so they can log in with the new password
      await supabase.auth.signOut();
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 relative"
      style={{
        backgroundImage: "url('/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl relative z-10">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Set New Password
        </h2>

        {message && (
          <div className={`p-3 mb-4 text-sm rounded border ${message.includes("Error") || message.includes("match") || message.includes("Invalid") ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
            {message}
          </div>
        )}

        {isValidSession ? (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white font-bold py-3 rounded-md hover:bg-green-600 transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Please check your email for a valid reset link.</p>
            <Link href="/forgot-password" className="text-blue-600 font-semibold hover:underline">
              Request a new link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}