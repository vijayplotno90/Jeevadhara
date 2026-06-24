"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CROP_CATEGORIES = [
  { id:"vegetables", label:"🥦 Vegetables" },
  { id:"fruits", label:"🍎 Fruits" },
  { id:"grains", label:"🌾 Grains & Cereals" },
  { id:"pulses", label:"🫘 Pulses & Lentils" },
  { id:"spices", label:"🌶 Spices" },
  { id:"honey", label:"🍯 Honey" },
  { id:"eggs", label:"🥚 Eggs" },
  { id:"mushrooms", label:"🍄 Mushrooms" },
  { id:"other", label:"📦 Other" },
];

const QUALITY_GRADES = ["Grade A (Premium)","Grade B (Standard)","Grade C (Economy)","Mixed"];
const UNITS = ["kg","ton","quintal","dozen","litre","piece","bundle"];

export default function ListProducePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name:"", name_telugu:"", category:"vegetables",
    quantity:"", unit:"kg", price:"",
    harvest_date:"", quality_grade:"Grade A (Premium)",
    description:"", is_organic:false,
  });
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [imagePreview, setImagePreview] = useState<string|null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("jd_role");
    if (role !== "farmer") { router.push("/auth/login"); }
  }, [router]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function uploadImageToS3(file: File): Promise<string|null> {
    setUploading(true);
    try {
      // Get pre-signed URL
      const res = await fetch("/api/upload", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { presignedUrl, publicUrl } = await res.json();

      // Upload directly to S3
      const uploadRes = await fetch(presignedUrl, {
        method:"PUT",
        headers:{"Content-Type": file.type},
        body: file,
      });
      if (!uploadRes.ok) throw new Error("S3 upload failed");
      return publicUrl;
    } catch(e) {
      console.error("Upload error:", e);
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let imageUrl: string|null = null;
      if (imageFile) {
        imageUrl = await uploadImageToS3(imageFile);
        if (!imageUrl) {
          setError("Image upload failed. Try again or skip the photo.");
          setLoading(false);
          return;
        }
      }

      const userId = localStorage.getItem("jd_user_id");
      const token = localStorage.getItem("jd_token");

      const payload = {
        ...form,
        quantity: parseFloat(form.quantity),
        price: parseFloat(form.price),
        image_url: imageUrl,
        farmer_id: userId,
      };

      const res = await fetch("/api/products", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to list produce");
        return;
      }

      setSuccess(true);
      setTimeout(()=>router.push("/farmer/dashboard"), 2000);
    } catch(e) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900">Produce Listed!</h2>
        <p className="text-gray-500 mt-2">Your product is now live on Fresh Harvest.</p>
        <p className="text-gray-400 text-sm mt-1">Redirecting to dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/farmer/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">List Your Produce</h1>
          <p className="text-gray-500 text-sm">మీ పంటను జాబితా చేయండి</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Photo <span className="text-gray-400 text-xs">(Strongly recommended — products with photos sell 3x faster)</span>
            </label>
            <div
              onClick={()=>fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <p className="text-xs text-green-600 mt-2">✓ Photo ready · Click to change</p>
                </div>
              ) : (
                <>
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm text-gray-600 font-medium">Click to upload product photo</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB · Will be stored on AWS S3</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          {/* Crop Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop / Product Name *</label>
              <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                placeholder="e.g. Organic Tomatoes" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telugu Name (optional)</label>
              <input value={form.name_telugu} onChange={e=>setForm(f=>({...f,name_telugu:e.target.value}))}
                placeholder="e.g. టొమాటో" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <div className="grid grid-cols-3 gap-2">
              {CROP_CATEGORIES.map(c=>(
                <button type="button" key={c.id} onClick={()=>setForm(f=>({...f,category:c.id}))}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-colors ${
                    form.category===c.id ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
                  }`}>{c.label}</button>
              ))}
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Available *</label>
              <input required type="number" step="0.1" value={form.quantity} onChange={e=>setForm(f=>({...f,quantity:e.target.value}))}
                placeholder="e.g. 500" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
              <select value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                {UNITS.map(u=><option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per {form.unit} (₹) *</label>
              <input required type="number" step="0.5" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}
                placeholder="e.g. 45" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          {/* Harvest Date & Grade */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
              <input type="date" value={form.harvest_date} onChange={e=>setForm(f=>({...f,harvest_date:e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quality Grade</label>
              <select value={form.quality_grade} onChange={e=>setForm(f=>({...f,quality_grade:e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                {QUALITY_GRADES.map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Organic toggle */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={()=>setForm(f=>({...f,is_organic:!f.is_organic}))}
              className={`w-12 h-6 rounded-full transition-colors relative ${form.is_organic ? "bg-green-500" : "bg-gray-300"}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${form.is_organic ? "right-1" : "left-1"}`} />
            </button>
            <label className="text-sm font-medium text-gray-700">
              🌱 Certified Organic Produce
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
            <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
              placeholder="Tell buyers about your produce — how it's grown, special qualities, farm practices..."
              rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          {/* Price preview */}
          {form.quantity && form.price && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
              <p className="text-green-800 font-semibold">📦 Listing Preview</p>
              <p className="text-green-700 mt-1">
                <strong>{form.name || "Your Product"}</strong> · {form.quantity} {form.unit} · ₹{form.price}/{form.unit}
              </p>
              <p className="text-green-600 text-xs mt-0.5">
                Est. total value: ₹{(parseFloat(form.price||"0") * parseFloat(form.quantity||"0")).toFixed(0)}
              </p>
            </div>
          )}

          <button type="submit" disabled={loading || uploading}
            className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors text-base">
            {uploading ? "📤 Uploading photo to AWS S3..." : loading ? "Listing produce..." : "✅ List Produce on Fresh Harvest"}
          </button>
        </form>
      </div>
    </div>
  );
}
