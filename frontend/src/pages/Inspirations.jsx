import React, { useState, useEffect, useCallback } from "react";
import useInspirations from "../hooks/useInspirations";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function Inspirations() {
  const { loading: authLoading, error: authError } = useAuth();
  const {
    loading: inspirationsLoading,
    error: inspirationsError,
    getInspirations,
  } = useInspirations();
  const [inspirations, setInspirations] = useState([]);
  const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    if (!authLoading) {
      const handler = setTimeout(async () => {
        try {
          const fetchedInspirations = await getInspirations(searchTag);
          setInspirations(fetchedInspirations || []);
        } catch (err) {
          console.error("Gagal mengambil inspirasi:", err);
          toast.error("Gagal memuat inspirasi: " + err.message);
        }
      }, 300);

      return () => clearTimeout(handler);
    }
  }, [getInspirations, searchTag, authLoading]);

  if (authLoading || inspirationsLoading) {
    return (
      <div className="p-8 text-center text-gray-700">
        <p className="animate-pulse">Memuat inspirasi...</p>
      </div>
    );
  }

  if (authError || inspirationsError) {
    return (
      <div className="p-8 text-center text-red-600">
        Error:{" "}
        {authError?.message ||
          inspirationsError?.message ||
          "Terjadi kesalahan"}
      </div>
    );
  }

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">
        Inspirasi Outfit
      </h1>
      <p className="mb-6 text-gray-600">
        Rekomendasi tampilan pakaian berdasarkan aktivitas harianmu.
      </p>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Cari outfit untuk... (misal: kampus, pesta, olahraga)"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          className="md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full p-3 border rounded-md"
        />
      </div>

      <div className="md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-6">
        {inspirations.length > 0 ? (
          inspirations.map((inspo) => (
            <div
              key={inspo.id}
              className="rounded-xl hover:shadow-lg overflow-hidden transition-shadow duration-300 bg-white shadow-md"
            >
              <div className="relative w-full h-56">
                <img
                  src={inspo.image_url}
                  alt={inspo.title}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  {inspo.title}
                </h2>
                <p className="line-clamp-2 text-sm text-gray-600">
                  {inspo.description}
                </p>
                <p className="mt-2 text-xs text-gray-500">Tags: {inspo.tag}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-3 text-center text-gray-500">
            Tidak ada inspirasi ditemukan untuk pencarian Anda.
          </div>
        )}
      </div>
    </div>
  );
}
