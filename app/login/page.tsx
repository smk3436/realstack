"use client";
import { useState, Suspense } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// We need to wrap the component in Suspense because it uses useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read the role from the URL (e.g., /login?role=owner)
  const initialRole = searchParams.get("role") === "owner" ? "owner" : "buyer";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialRole);
  // If a specific role is passed in the URL, default to Sign Up mode
  const [isSignUp, setIsSignUp] = useState(searchParams.has("role"));
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: role } },
      });
      if (error) alert(error.message);
      else alert("Check your email for the confirmation link!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else router.push("/");
    }
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 relative"
      style={{
        backgroundImage: "url('/login-bg.png')", // Make sure your image is in the public folder!
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl relative z-10">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white placeholder-gray-500"
          />

          {/* Forgot Password Link (Only shows on Log In mode) */}
          {!isSignUp && (
            <div className="flex justify-end pt-1">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}

          {/* Role Selection (Only on Sign Up mode) */}
          {isSignUp && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-2">
              <p className="text-sm font-semibold text-gray-700 mb-2">I am a:</p>
              <div className="flex gap-4 text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="buyer" checked={role === "buyer"} onChange={() => setRole("buyer")} className="w-4 h-4 text-blue-600"/>
                  Buyer / Renter
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="owner" checked={role === "owner"} onChange={() => setRole("owner")} className="w-4 h-4 text-blue-600"/>
                  Property Owner
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition shadow-md"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 font-semibold hover:underline">
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

// Next.js requires useSearchParams to be wrapped in a Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}