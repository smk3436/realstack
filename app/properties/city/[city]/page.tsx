import { supabase } from "../../../../lib/supabaseClient";
import PropertyCard from "../../../components/PropertyCard";
import { notFound } from "next/navigation";

export const instant = false;

// 1. Define the Metadata function for SEO (Google Search Results)
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  // FIX: Await the params promise
  const resolvedParams = await params;
  const cityName = resolvedParams.city.charAt(0).toUpperCase() + resolvedParams.city.slice(1);

  return {
    title: `Flats for Sale in ${cityName} Without Brokerage | Realstack`,
    description: `Find verified 1BHK, 2BHK, 3BHK apartments and villas for sale in ${cityName} directly from owners. Zero brokerage fees. Save lakhs on your dream home.`,
  };
}

// 2. The Main Page Component
export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  // FIX: Await the params promise before using it
  const resolvedParams = await params;
  const cityName = resolvedParams.city.charAt(0).toUpperCase() + resolvedParams.city.slice(1);

  // 3. Fetch properties from Supabase for THIS specific city (case-insensitive)
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .ilike("city", cityName) // "ilike" ignores uppercase/lowercase
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // If there is a database error, show a 404 page
  if (error) {
    console.error(error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* 4. The SEO H1 Tag */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Find 1BHK, 2BHK, 3BHK Flats in {cityName} <br />
            <span className="text-green-600">Without Brokerage</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse verified properties directly from owners in {cityName}. No middlemen, no hidden fees, and no spam.
          </p>
        </div>

        {/* 5. Display Properties */}
        {properties && properties.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Available Properties in {cityName} ({properties.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No properties found in {cityName}</h2>
            <p className="text-gray-500">Be the first to list a property in this city!</p>
          </div>
        )}
      </div>
    </div>
  );
}