import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-white mb-2">Realstack</h2>
          <p>Zero Brokerage. Full Trust. Made in India.</p>
        </div>
        <div className="flex space-x-6">
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/dashboard/add-property" className="hover:text-white">List Property</Link>
        </div>
      </div>
      <div className="text-center mt-8 text-sm text-gray-500">
        © 2026 Realstack. All rights reserved.
      </div>
    </footer>
  );
}