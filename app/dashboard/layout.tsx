"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setRole(user?.user_metadata?.role || null);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Dashboard</h2>
        
        {role === "owner" && (
          <Link 
            href="/dashboard/my-properties" 
            className={`p-3 rounded-md font-semibold transition ${pathname === '/dashboard/my-properties' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            🏠 My Properties
          </Link>
        )}

        {role === "buyer" && (
          <Link 
            href="/dashboard/saved" 
            className={`p-3 rounded-md font-semibold transition ${pathname === '/dashboard/saved' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            ❤️ Saved Homes
          </Link>
        )}

        {role === "owner" && (
          <Link 
            href="/dashboard/add-property" 
            className={`p-3 rounded-md font-semibold transition ${pathname === '/dashboard/add-property' ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            ➕ Add New Property
          </Link>
        )}
      </aside>

      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}