"use client";
import { useState } from "react";
import Link from "next/link";

export default function PropertyCard({ property }: { property: any }) {
  const [showModal, setShowModal] = useState(false);
  
  // Mock logic for premium and fairness
  const isPremium = property.id.charCodeAt(property.id.length - 1) % 2 === 0;
  const isFairPrice = property.price < 8000000; 

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative">
        {isPremium && (
          <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10 shadow-md">
            ⭐ Premium
          </div>
        )}
        <div className="h-48 bg-gray-200 relative">
          <img src={property.image_urls?.[0] || "https://via.placeholder.com/400x300"} alt={property.title} className="w-full h-full object-cover" />
          {property.is_verified && (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">✅ Verified</span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 truncate">{property.title}</h3>
          <p className="text-gray-500 text-sm mb-2">{property.locality}, {property.city}</p>
          
          <div className="flex items-center gap-2 mb-3">
            {isFairPrice ? (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-semibold">🔥 Fair Price</span>
            ) : (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-semibold">⚠️ Above Avg</span>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="text-blue-700 font-bold text-xl">₹{property.price.toLocaleString('en-IN')}</span>
            <div className="flex gap-2">
              <button onClick={() => setShowModal(true)} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300 transition">Quick View</button>
              <Link href={`/properties/${property.id}`} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">View</Link>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-4 text-gray-500 text-2xl hover:text-black">&times;</button>
            <img src={property.image_urls?.[0]} className="w-full h-48 object-cover rounded mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">{property.title}</h2>
            <p className="text-gray-500 mb-4">{property.locality}, {property.city}</p>
            <p className="text-3xl font-extrabold text-blue-700 mb-4">₹{property.price.toLocaleString('en-IN')}</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
              <div className="bg-gray-100 p-2 rounded"><strong>Type:</strong> {property.property_type}</div>
              <div className="bg-gray-100 p-2 rounded"><strong>BHK:</strong> {property.bhk}</div>
              <div className="bg-gray-100 p-2 rounded"><strong>Area:</strong> {property.area_sqft} sq.ft</div>
            </div>
            <Link href={`/properties/${property.id}`} className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700">View Full Details</Link>
          </div>
        </div>
      )}
    </>
  );
}