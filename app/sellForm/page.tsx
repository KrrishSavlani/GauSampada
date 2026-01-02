"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    species: "cow",
    name: "",
    breed: "",
    ageMonths: "",
    gender: "unknown",
    price: "",
    weightKg: "",
    location: "",
    description: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages(fileArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Add form fields
      formData.append("species", form.species);
      formData.append("name", form.name);
      formData.append("breed", form.breed);
      formData.append("ageMonths", form.ageMonths);
      formData.append("gender", form.gender);
      formData.append("price", form.price);
      formData.append("weightKg", form.weightKg);
      formData.append("location", form.location);
      formData.append("description", form.description);

      // Add images
      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await fetch("/api/animals", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Animal listing created successfully!");
        // Reset form
        setForm({
          species: "cow",
          name: "",
          breed: "",
          ageMonths: "",
          gender: "unknown",
          price: "",
          weightKg: "",
          location: "",
          description: "",
        });
        setImages([]);
        // Optionally redirect after a delay
        setTimeout(() => {
          router.push("/marketplace");
        }, 1500);
      } else {
        setError(data.message || "Failed to create listing");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-xl mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6">

          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Sell Your Animal
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Species */}
            <div>
              <label className="text-sm font-medium">Species *</label>
              <select
                  name="species"
                  value={form.species}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border rounded-xl px-3 py-2"
              >
                <option value="cow">Cow</option>
                <option value="cattle">Cattle</option>
                <option value="buffalo">Buffalo</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium">Animal Name</label>
              <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Gauri"
                  className="mt-1 w-full border rounded-xl px-3 py-2"
              />
            </div>

            {/* Breed */}
            <div>
              <label className="text-sm font-medium">Breed</label>
              <input
                  name="breed"
                  value={form.breed}
                  onChange={handleChange}
                  placeholder="e.g. Gir, Murrah"
                  className="mt-1 w-full border rounded-xl px-3 py-2"
              />
            </div>

            {/* Age + Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Age (Months)</label>
                <input
                    type="number"
                    name="ageMonths"
                    value={form.ageMonths}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Gender</label>
                <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-xl px-3 py-2"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="text-sm font-medium">Price (₹) *</label>
              <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border rounded-xl px-3 py-2"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="text-sm font-medium">Weight (Kg)</label>
              <input
                  type="number"
                  name="weightKg"
                  value={form.weightKg}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-xl px-3 py-2"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium">Location</label>
              <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Village, District, State"
                  className="mt-1 w-full border rounded-xl px-3 py-2"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Milk yield, health, vaccination..."
                  className="mt-1 w-full border rounded-xl px-3 py-2"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium">Images *</label>
              <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  required
                  className="mt-1 w-full border rounded-xl px-3 py-2"
              />
              {images.length > 0 && (
                  <p className="mt-1 text-sm text-gray-600">
                    {images.length} image(s) selected
                  </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
                  {error}
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="mt-4 text-sm text-green-600 bg-green-50 p-3 rounded">
                  {success}
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700
            text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Listing"}
            </button>
          </form>
        </div>
      </div>
  );
}
