import { supabase } from "../../lib/supabaseClient";
import PropertyCard from "../components/PropertyCard";

export default async function SearchResults({
  searchParams,
}: {
  // FIX: Next.js 15+ requires searchParams to be a Promise
  searchParams: Promise<{ city?: string; type?: string; bhk?: string }>;
}) {
  // Await the searchParams before using them
  const resolvedSearchParams = await searchParams;

  // Build the Supabase query dynamically
  let query = supabase.from("properties").select("*").eq("status", "active");

  // 1. Filter by City
  if (resolvedSearchParams.city) {
    query = query.ilike("city", resolvedSearchParams.city);
  }

  // 2. Filter by Property Type
  if (resolvedSearchParams.type) {
    query = query.ilike("property_type", resolvedSearchParams.type);
  }

  // 3. Filter by BHK (Handling "4+" separately)
  if (resolvedSearchParams.bhk) {
    if (resolvedSearchParams.bhk === "4+") {
      query = query.gte("bhk", 4); // Greater than or equal to 4
    } else {
      query = query.eq("bhk", parseInt(resolvedSearchParams.bhk));
    }
  }

  const { data: properties } = await query;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Search Results {resolvedSearchParams.city && `in ${resolvedSearchParams.city}`}
        {resolvedSearchParams.type && ` for ${resolvedSearchParams.type}`}
      </h1>

      {properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl text-gray-600 mb-2">No properties found</h2>
          <p className="text-gray-500">Try adjusting your filters or searching in a different city.</p>
        </div>
      )}
    </div>
  );
}