"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Array of sidebar links
  const sidebarLinks = [
    { name: "About Us", path: "/about" },
    { name: "Additional Services", path: "/about/services" },
    { name: "Owners", path: "/about/owners" },
    { name: "Listing Using Whatsapp", path: "/about/whatsapp" },
    { name: "Tenants", path: "/about/tenants" },
    { name: "Team", path: "/about/team" },
    { name: "FAQ", path: "/about/faq" },
    { name: "Our Blog", path: "/about/blog" },
    { name: "Contact Us", path: "/about/contact" },
  ];

  return (
    // This adds a nice, subtle real-estate background image
    <div 
      className="min-h-screen py-12 px-4 font-sans relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* White overlay to make text readable over the background image */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-0"></div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 relative z-10">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-white border border-gray-200 rounded-sm shadow-md sticky top-24">
            <ul className="text-gray-700 text-sm">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <li key={link.name} className="border-b border-gray-100 last:border-0">
                    <Link 
                      href={link.path} 
                      className={`block p-4 transition-colors ${
                        isActive 
                          ? "bg-gray-500 text-white font-semibold" 
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right Content Area (This is where your pages will load) */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <div className="bg-white p-8 border border-gray-200 rounded-sm shadow-md min-h-[500px]">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}