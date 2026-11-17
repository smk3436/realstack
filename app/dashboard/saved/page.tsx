"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import PropertyCard from "../../components/PropertyCard";
import Link from "next/link";

export default function SavedProperties() {
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  const fetchSavedProperties = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("saved_properties")
      .select(`
        property_id,
        properties (*)
      `)
      .eq("user_id", user.id);

    if (data) {
      const props = data.map((item: any) => item.properties).filter(Boolean);
      setSavedProperties(props);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-20 font-semibold">Loading saved homes...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Saved Homes</h1>
      {savedProperties.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 mb-4">You haven't saved any properties yet.</p>
          <Link href="/properties" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Browse Properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
}