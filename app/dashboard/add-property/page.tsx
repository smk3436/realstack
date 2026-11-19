"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

// Change @/lib/... to ../../../lib/...
import { computeVastu, Direction } from "../../../lib/vastu-calculator";

const DIRECTIONS = [
  "North", "Northeast", "East", "Southeast",
  "South", "Southwest", "West", "Northwest",
];

export default function AddProperty() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // ⬇️ ADDED VASTU FIELDS TO STATE
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    locality: "",
    property_type: "Apartment",
    bhk: "",
    area_sqft: "",
    owner_name: "",
    owner_phone: "",
    vastu_facing: "",
    vastu_entrance: "",
    vastu_hall: "",
    vastu_masterBedroom: "",
    vastu_kitchen: "",
    vastu_toilet: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.user_metadata?.role !== "owner") {
        alert("Access Denied: You must be logged in as a Property Owner.");
        router.push("/login");
      } else {
        setUserId(user.id);
        setAuthorized(true);
      }
      setCheckingAuth(false);
    };
    checkUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }
    
    setLoading(true);

    try {
      const uploadedImageUrls: string[] = [];

      // 1. Upload Images
      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(`Image Upload Failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);

        uploadedImageUrls.push(urlData.publicUrl);
      }

      // 2. Compute Vastu Data (Only if all fields are filled)
      const vastuInput = {
        facing: formData.vastu_facing as Direction,
        entrance: formData.vastu_entrance as Direction,
        hall: formData.vastu_hall as Direction,
        masterBedroom: formData.vastu_masterBedroom as Direction,
        kitchen: formData.vastu_kitchen as Direction,
        toilet: formData.vastu_toilet as Direction,
      };

      const isVastuFilled = Object.values(vastuInput).every((val) => Boolean(val));
      const vastuData = isVastuFilled ? computeVastu(vastuInput) : {};

      // 3. Save to Database
      const { error: dbError } = await supabase.from("properties").insert([
        {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          city: formData.city,
          locality: formData.locality,
          property_type: formData.property_type,
          bhk: formData.bhk ? parseInt(formData.bhk) : 0, 
          area_sqft: parseInt(formData.area_sqft),
          owner_name: formData.owner_name,
          owner_phone: formData.owner_phone,
          image_urls: uploadedImageUrls,
          is_verified: false, 
          status: "active",
          owner_id: userId,
          ...vastuData, // ⬅️ Spread the computed Vastu fields into the insert payload
        },
      ]);

      if (dbError) {
        throw new Error(`Database Error: ${dbError.message} - ${dbError.details || ''}`);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/my-properties"); 
      }, 2000);

    } catch (error: any) {
      console.error("FULL ERROR:", error);
      alert(error.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300 animate-pulse">Verifying authorization...</div>
      </div>
    );
  }

  if (!authorized) return null; 

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">List Your Property</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Zero Brokerage. Connect directly with buyers.</p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-md mb-8 flex flex-wrap gap-2 justify-between text-xs font-semibold text-blue-800 dark:text-blue-300">
          <div className="text-center flex-1">1. Confirm Owner ✅</div>
          <div className="text-center flex-1">2. Check Papers 📄</div>
          <div className="text-center flex-1">3. Visit & Photograph 📸</div>
          <div className="text-center flex-1">4. Weekly Check 🗓️</div>
        </div>

        {success ? (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-6 rounded-md text-center text-lg font-bold">
            ✅ Property Listed Successfully! Redirecting to Dashboard...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Property Title</label>
                <input required type="text" name="title" onChange={handleChange} placeholder="e.g. 2BHK Apartment in Kharadi" className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Property Type</label>
                <select name="property_type" onChange={handleChange} className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                  <option value="Apartment">Flat / Apartment</option>
                  <option value="Villa">Villa / House</option>
                  <option value="Plot">Plot / Land</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">City</label>
                <input required type="text" name="city" onChange={handleChange} placeholder="e.g. Pune" className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Locality</label>
                <input required type="text" name="locality" onChange={handleChange} placeholder="e.g. Kharadi" className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                <input required type="number" name="price" onChange={handleChange} placeholder="e.g. 7500000" className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">BHK (Leave 0 for plots)</label>
                <input type="number" name="bhk" onChange={handleChange} placeholder="e.g. 2" className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Area (Sq. Ft.)</label>
                <input required type="number" name="area_sqft" onChange={handleChange} placeholder="e.g. 1050" className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea required name="description" onChange={handleChange} rows={4} placeholder="Describe the property, amenities, etc." className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"></textarea>
            </div>

            {/* ⬇️ NEW: VASTU DETAILS SECTION ⬇️ */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Vastu Details</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Select the direction for each room. The Vastu score will be calculated automatically.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Facing Direction</label>
                  <select name="vastu_facing" onChange={handleChange} className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <option value="">Select...</option>
                    {DIRECTIONS.map((dir) => <option key={dir} value={dir}>{dir}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Main Entrance</label>
                  <select name="vastu_entrance" onChange={handleChange} className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <option value="">Select...</option>
                    {DIRECTIONS.map((dir) => <option key={dir} value={dir}>{dir}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Hall / Living Room</label>
                  <select name="vastu_hall" onChange={handleChange} className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <option value="">Select...</option>
                    {DIRECTIONS.map((dir) => <option key={dir} value={dir}>{dir}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Master Bedroom</label>
                  <select name="vastu_masterBedroom" onChange={handleChange} className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <option value="">Select...</option>
                    {DIRECTIONS.map((dir) => <option key={dir} value={dir}>{dir}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Kitchen</label>
                  <select name="vastu_kitchen" onChange={handleChange} className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <option value="">Select...</option>
                    {DIRECTIONS.map((dir) => <option key={dir} value={dir}>{dir}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Toilet</label>
                  <select name="vastu_toilet" onChange={handleChange} className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <option value="">Select...</option>
                    {DIRECTIONS.map((dir) => <option key={dir} value={dir}>{dir}</option>)}
                  </select>
                </div>
              </div>
            </div>
            {/* ⬆️ END OF VASTU SECTION ⬆️ */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                <input required type="text" name="owner_name" onChange={handleChange} className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Phone Number</label>
                <input required type="tel" name="owner_phone" onChange={handleChange} className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload Photos</label>
              <input required type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-white" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Hold Ctrl (or Cmd) to select multiple images.</p>
              
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((file, index) => (
                    <div key={index} className="h-24 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md">
              <h3 className="font-bold text-yellow-800 dark:text-yellow-500 mb-2">Choose Your Listing Plan</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded border border-yellow-200 dark:border-yellow-800 cursor-pointer hover:border-blue-500 transition">
                  <input type="radio" name="plan" defaultChecked value="standard" className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">Standard Listing (Free)</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">List your property for free. Pay only when the deal closes.</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded border border-yellow-200 dark:border-yellow-800 cursor-pointer hover:border-yellow-500 transition">
                  <input type="radio" name="plan" value="premium" className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white flex items-center gap-2">Premium Listing <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded">₹30,000</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Feature your property at the top and get 5x more visibility.</p>
                  </div>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-bold py-3 rounded-md transition text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 shadow-lg transform hover:-translate-y-1'}`}
            >
              {loading ? "Uploading & Saving..." : "List Property (Zero Brokerage)"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}