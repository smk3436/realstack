"use client"; // Required for dynamic form state

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import PropertyCard from "./components/PropertyCard";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);

  // Filter state
  const [propertyType, setPropertyType] = useState("");

  // Fetch featured properties
  useEffect(() => {
    const fetchProperties = async () => {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(6);
      if (data) setProperties(data);
    };
    fetchProperties();
  }, []);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const city = formData.get("city");
    const type = formData.get("type");
    const bhk = formData.get("bhk");

    // Build URL Query Params
    const params = new URLSearchParams();
    if (city) params.append("city", city.toString());
    if (type) params.append("type", type.toString());
    if (bhk) params.append("bhk", bhk.toString());

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-900 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Find a Home Without the Brokerage. <br />
          <span className="text-green-400">Direct from Owners.</span>
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white p-3 rounded-lg shadow-lg flex flex-col md:flex-row gap-3 mt-8">
          <select name="city" className="flex-1 p-3 border rounded-md text-gray-700 outline-none">
            <option value="">Select City</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Delhi">Delhi NCR</option>
          </select>

          <select
            name="type"
            onChange={(e) => setPropertyType(e.target.value)}
            className="flex-1 p-3 border rounded-md text-gray-700 outline-none"
          >
            <option value="">Any Type</option>
            <option value="Apartment">Flat / Apartment</option>
            <option value="Villa">Villa / House</option>
            <option value="Commercial">Commercial</option>
            <option value="Plot">Land / Plot</option>
          </select>

          {/* Conditional BHK Dropdown (Only shows if Apartment or Villa is selected) */}
          {(propertyType === "Apartment" || propertyType === "Villa") && (
            <select name="bhk" className="flex-1 p-3 border rounded-md text-gray-700 outline-none bg-blue-50">
              <option value="">Any BHK</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4+">4+ BHK</option>
            </select>
          )}

          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-md transition shadow-lg transform hover:-translate-y-1">
  Search
</button>
        </form>
      </section>

      {/* Featured Properties (Keep your existing code here) */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Featured Properties</h2>
          <Link href="/properties" className="text-blue-600 font-semibold hover:underline">View All</Link>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No properties listed yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}