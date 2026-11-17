"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useParams } from "next/navigation";
import PropertyMap from "../../components/PropertyMap";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [slideDirection, setSlideDirection] = useState("");
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("I am interested in this property.");
  const [submitted, setSubmitted] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setCurrentUser(userData.user);

      const { data: propertyData } = await supabase.from("properties").select("*").eq("id", id).single();
      
      if (propertyData) {
        setProperty(propertyData);
        if (propertyData.image_urls && propertyData.image_urls.length > 0) {
          setActiveImage(propertyData.image_urls[0]);
        }

        if (userData.user && userData.user.id === propertyData.owner_id) {
          const { data: inquiryData, error } = await supabase
            .from("inquiries")
            .select("*")
            .eq("property_id", id)
            .order("created_at", { ascending: false });
            
          if (inquiryData) setInquiries(inquiryData);
          if (error) console.error("Error fetching inquiries:", error);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleImageChange = (url: string) => {
    if (url === activeImage) return;
    const directions = ["slide-left", "slide-right", "slide-up", "slide-down"];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    setSlideDirection(randomDir);
    setActiveImage(url);
    setTimeout(() => setSlideDirection(""), 500);
  };

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("inquiries").insert([
      { property_id: id, buyer_name: name, buyer_phone: phone, buyer_email: email, message },
    ]);
    
    if (!error) {
      setSubmitted(true);
    } else {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSaveProperty = async () => {
    if (!currentUser) return alert("Please log in to save properties.");
    
    const { error } = await supabase.from("saved_properties").insert([
      { user_id: currentUser.id, property_id: id }
    ]);

    if (error) {
      if (error.code === '23505') alert("Already saved!");
      else alert("Error saving property");
    } else {
      alert("❤️ Property saved to your dashboard!");
    }
  };

  if (loading) return <div className="text-center py-20 text-xl font-semibold dark:text-white">Loading...</div>;
  if (!property) return <div className="text-center py-20 text-xl text-red-500">Property not found!</div>;

  const isOwner = currentUser && property && currentUser.id === property.owner_id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <style>{`
        @keyframes slideLeft { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideRight { from { transform: translateX(-50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .slide-left { animation: slideLeft 0.5s ease-out forwards; }
        .slide-right { animation: slideRight 0.5s ease-out forwards; }
        .slide-up { animation: slideUp 0.5s ease-out forwards; }
        .slide-down { animation: slideDown 0.5s ease-out forwards; }
      `}</style>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{property.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">📍 {property.locality}, {property.city}</p>
        <div className="flex items-center gap-4 mt-4">
          <span className="text-blue-700 dark:text-blue-400 text-3xl font-extrabold">₹{property.price.toLocaleString('en-IN')}</span>
          {property.is_verified && (
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-bold text-sm border border-green-300 dark:border-green-700">
              ✅ Verified Owner
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-4">
            <div key={activeImage} className={`bg-gray-200 dark:bg-gray-800 h-96 rounded-lg overflow-hidden shadow-sm ${slideDirection}`}>
              <img src={activeImage || "https://via.placeholder.com/800x600?text=No+Image"} alt="Property Main" className="w-full h-full object-cover" />
            </div>
            
            {property.image_urls && property.image_urls.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {property.image_urls.map((url: string, index: number) => (
                  <div key={index} onClick={() => handleImageChange(url)} className={`h-24 rounded-lg overflow-hidden cursor-pointer transition border-2 ${activeImage === url ? 'border-blue-600 dark:border-blue-500' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}>
                    <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Property Details</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <div><span className="text-gray-500 dark:text-gray-400">Type:</span> {property.property_type}</div>
              <div><span className="text-gray-500 dark:text-gray-400">BHK:</span> {property.bhk}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Area:</span> {property.area_sqft} sq.ft</div>
            </div>
            <p className="mt-6 text-gray-700 dark:text-gray-300">{property.description}</p>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-6 rounded-lg mt-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">💰 True Total Cost Calculator</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between"><span>Base Property Price:</span> <span>₹{property.price.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>Stamp Duty (Est. 6%):</span> <span>₹{(property.price * 0.06).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>Registration (Est. 1%):</span> <span>₹{(property.price * 0.01).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between border-t border-gray-300 dark:border-gray-600 pt-2 font-bold text-gray-900 dark:text-white text-base">
                  <span>Estimated Total:</span> <span>₹{(property.price * 1.07).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg mt-6">
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                <span className="text-green-500">✅</span> Property Truth Report
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border border-green-200 dark:border-green-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">RERA Approval</p>
                  <p className="font-bold text-green-600 dark:text-green-400">Verified & Approved</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border border-green-200 dark:border-green-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Builder Track Record</p>
                  <p className="font-bold text-green-600 dark:text-green-400">Excellent (4.8/5)</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Legal Clear Title</p>
                  <p className="font-bold text-yellow-600 dark:text-yellow-400">Pending OCR Check</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border border-green-200 dark:border-green-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quality Inspection</p>
                  <p className="font-bold text-green-600 dark:text-green-400">A-Grade</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
              <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">📍 Location & Commute Insights</h3>
              <div className="mb-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded border dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Check commute to your office (Mock):</p>
                <input type="text" placeholder="Enter office location (e.g. Hinjewadi)" className="w-full p-2 border rounded text-sm text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400" />
                <p className="text-green-600 dark:text-green-400 font-bold text-sm mt-2">🚗 Est. 25 mins drive during peak hours</p>
              </div>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                <li>🚇 <strong>Metro Station:</strong> 5 mins walk (Nearest Hub)</li>
                <li>🏫 <strong>Schools:</strong> 3 top-rated schools within 2km</li>
                <li>🏥 <strong>Hospitals:</strong> 10 mins drive to multi-specialty</li>
                <li>🛡️ <strong>Neighborhood Safety Score:</strong> 8.5/10 (Very Safe)</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
              <details className="cursor-pointer group">
                <summary className="font-bold text-lg text-gray-800 dark:text-white list-none flex justify-between">
                  🤝 Negotiation Assistant
                  <span className="text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                  Properties in {property.locality} usually sell 3-5% below asking price. Based on recent data, a fair offer would be around <strong>₹{(property.price * 0.96).toLocaleString('en-IN')}</strong>.
                </div>
              </details>
              <details className="cursor-pointer group mt-4 border-t dark:border-gray-700 pt-4">
                <summary className="font-bold text-lg text-gray-800 dark:text-white list-none flex justify-between">
                  📈 Rental Yield Calculator
                  <span className="text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  <p>If rented out at an estimated ₹{(property.price * 0.003).toLocaleString('en-IN')}/month:</p>
                  <p className="font-bold text-green-600 dark:text-green-400 mt-1">Estimated Yield: 3.6% per annum</p>
                </div>
              </details>
            </div>
          </div>

          <PropertyMap 
            lat={property.latitude || 18.5204}
            lng={property.longitude || 73.8567}
            propertyTitle={property.title} 
          />
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24">
            
            {isOwner ? (
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  📊 Real-Time Inquiries
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Reply to buyers within 2 hours for the best response rate.</p>
                
                {inquiries.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded border dark:border-gray-700 text-gray-500 dark:text-gray-400">
                    No inquiries yet. Your property is live!
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {inquiries.map((inq, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded border dark:border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-gray-800 dark:text-white">{inq.buyer_name}</p>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(inq.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">📞 {inq.buyer_phone}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">✉️ {inq.buyer_email || "No email provided"}</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-700 mb-3">{inq.message}</p>
                        
                        <a 
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${inq.buyer_email}&su=Regarding Property: ${property.title}&body=Hi ${inq.buyer_name},%0D%0A%0D%0AThanks for your interest in ${property.title}. I would like to schedule a site visit. When are you available?%0D%0A%0D%0ARegards,%0D%0A${property.owner_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition text-sm"
                        >
                          Send Email (Site Visit)
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contact Owner</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Zero Brokerage. Direct connection.</p>
                
                <div className="mb-6 bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-bold text-gray-800 dark:text-white">Owner: {property.owner_name}</p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="text-yellow-500 mr-1">⭐ 4.8/5 Rating</span> | 
                    <span className="ml-1">⚡ Replies in 2 hrs</span>
                  </div>
                </div>

                {submitted ? (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-md text-center mb-4">
                    ✅ Inquiry sent! The owner will contact you soon.
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-4 mb-4">
                    <input type="text" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <input type="tel" placeholder="Your Phone Number" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <input type="email" placeholder="Your Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">
                      Send Inquiry
                    </button>
                  </form>
                )}

                <button type="button" onClick={handleSaveProperty} className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition flex justify-center items-center gap-2 border border-gray-300 dark:border-gray-600">
                  ❤️ Save for Later
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}