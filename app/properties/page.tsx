import { Suspense } from "react";
import { supabase } from "../../lib/supabaseClient";
import PropertyCard from "../components/PropertyCard";

// 1. This is the component that actually uses searchParams.
// We will wrap it in a Suspense boundary below.
async function SearchResults({ searchParams }: { searchParams: Promise<{ city?: string; type?: string; bhk?: string }> }) {
  const resolvedSearchParams = await searchParams;

  let query = supabase.from("properties").select("*").eq("status", "active");

  if (resolvedSearchParams.city) {
    query = query.ilike("city", resolvedSearchParams.city);
  }

  if (resolvedSearchParams.type) {
    query = query.ilike("property_type", resolvedSearchParams.type);
  }

  if (resolvedSearchParams.bhk) {
    if (resolvedSearchParams.bhk === "4+") {
      query = query.gte("bhk", 4);
    } else {
      query = query.eq("bhk", parseInt(resolvedSearchParams.bhk));
    }
  }

  const { data: properties } = await query;

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-2">No properties found</h2>
        <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or searching in a different city.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

// 2. This is the main page component.
// It wraps the SearchResults component in a Suspense boundary.
export default function PropertiesPage({ searchParams }: { searchParams: Promise<{ city?: string; type?: string; bhk?: string }> }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Search Results
      </h1>

      {/* The Suspense boundary is the crucial fix */}
      <Suspense fallback={<div className="text-center py-20 text-xl font-semibold dark:text-white">Loading properties...</div>}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}