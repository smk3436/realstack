"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";

export default function MyProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setProperties(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      await supabase.from("properties").delete().eq("id", id);
      fetchMyProperties();
    }
  };

  if (loading) return <div className="text-center py-20 font-semibold">Loading your properties...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Properties</h1>
      {properties.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 mb-4">You haven't listed any properties yet.</p>
          <Link href="/dashboard/add-property" className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">List a Property</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <img src={prop.image_urls?.[0]} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-gray-800 truncate">{prop.title}</h3>
                <p className="text-blue-700 font-bold">₹{prop.price.toLocaleString('en-IN')}</p>
                <div className="flex gap-2 mt-4">
                  <Link href={`/properties/${prop.id}`} className="flex-1 text-center bg-blue-50 text-blue-700 py-2 rounded border border-blue-200 text-sm font-semibold hover:bg-blue-100">View</Link>
                  <button onClick={() => handleDelete(prop.id)} className="flex-1 bg-red-50 text-red-700 py-2 rounded border border-red-200 text-sm font-semibold hover:bg-red-100">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}