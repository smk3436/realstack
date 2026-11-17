"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { supabase } from "../../lib/supabaseClient";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const loginMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setRole(session?.user?.user_metadata?.role || null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setRole(session?.user?.user_metadata?.role || null);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (loginMenuRef.current && !loginMenuRef.current.contains(event.target as Node)) setIsLoginMenuOpen(false);
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setIsProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      authListener.subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    if (city) router.push(`/properties/city/${city.toLowerCase()}`);
  };

  if (!mounted) return null;

  return (
    <nav className="bg-blue-900 dark:bg-gray-950 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50 transition-colors duration-300">
      <Link href="/" className="text-2xl font-bold tracking-tight text-white">Realstack</Link>
      
      <div className="space-x-6 hidden md:flex items-center">
        <Link href="/" className="hover:text-blue-300 transition">Home</Link>
        <Link href="/properties" className="hover:text-blue-300 transition">All Properties</Link>
        
        <select onChange={handleCityChange} defaultValue="" className="bg-blue-800 dark:bg-gray-800 text-white p-2 rounded outline-none border border-blue-700 dark:border-gray-700 cursor-pointer">
          <option value="" disabled>Select City</option>
          <option value="pune">Pune</option>
          <option value="mumbai">Mumbai</option>
          <option value="bangalore">Bangalore</option>
          <option value="delhi">Delhi</option>
        </select>

        {role === "owner" && (
          <Link href="/dashboard/add-property" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md font-semibold transition text-white shadow-sm">
            List Property
          </Link>
        )}

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full bg-blue-800 dark:bg-gray-800 hover:bg-blue-700 dark:hover:bg-gray-700 transition"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
          ) : (
            <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
          )}
        </button>

        {user ? (
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-10 h-10 rounded-full bg-blue-800 dark:bg-gray-800 hover:bg-blue-700 dark:hover:bg-gray-700 border border-blue-500 dark:border-gray-600 flex items-center justify-center transition focus:outline-none"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm5.65 3.64l-1.41-1.41L18.59 14H14v-2h4.59l-2.35-2.23 1.41-1.41L22.41 13l-4.76 4.64z"/></svg>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">My Account</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</p>
                </div>
                <Link href={role === 'owner' ? '/dashboard/my-properties' : '/dashboard/saved'} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left block px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-bold transition">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative" ref={loginMenuRef}>
            <button onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)} className="bg-white dark:bg-gray-800 text-blue-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-6 py-2 rounded-md font-semibold transition flex items-center gap-2 border border-transparent dark:border-gray-600">
              Login
              <svg className={`w-4 h-4 transition-transform ${isLoginMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isLoginMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                <Link href="/login?role=buyer" onClick={() => setIsLoginMenuOpen(false)} className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 transition text-left">
                  <p className="font-bold text-gray-900 dark:text-white text-base">Buyer / Renter</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find your next home directly</p>
                </Link>
                <Link href="/login?role=owner" onClick={() => setIsLoginMenuOpen(false)} className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left">
                  <p className="font-bold text-gray-900 dark:text-white text-base">Property Owner</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">List your property for free</p>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}