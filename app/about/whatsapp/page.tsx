export default function WhatsappListingPage() {
  return (
    <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-4">
        How to list using Whatsapp?
      </h1>
      
      <p>
        Realstack understands that not everyone has the time & expertise to use a computer to list a property. To solve this problem, we have made the listing even simpler.
      </p>

      <p>
        You just need to send us the information on <strong>WhatsApp on +919307109052</strong> and we will create your login for you! No need of a computer or calling anyone. Our Customer Service Representative will call you and take whatever info is required. Nothing can be simpler and quicker than this!
      </p>

      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <h2 className="text-xl font-bold text-green-800 mb-4">Ready to list?</h2>
        <a 
          href="https://wa.me/9307109052?text=Hi%20Realstack,%20I%20want%20to%20list%20my%20property." 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}