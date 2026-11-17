export default function ContactPage() {
  return (
    <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-4">
        Contact Us
      </h1>
      
      <p>
        In case you have any questions, suggestions or if you just want to have a general talk with us. You can reach out to us by any of the below means:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Traditional Way */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Traditional Way</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-500 text-sm">Write to us</span>
              <a href="mailto:assist@realstack.in" className="text-blue-600 hover:underline">assist@realstack.in</a>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-500 text-sm">Media Query</span>
              <a href="mailto:media@realstack.in" className="text-blue-600 hover:underline">media@realstack.in</a>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-500 text-sm">Contact</span>
              <a href="tel:+919307109052" className="text-blue-600 hover:underline">+91 9307109052</a>
            </div>
          </div>
        </div>

        {/* Social Network */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Reach us on social network</h2>
          <div className="flex gap-4">
            {/* Facebook Icon */}
            <a href="#" className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            </a>
            {/* Twitter/X Icon */}
            <a href="#" className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}