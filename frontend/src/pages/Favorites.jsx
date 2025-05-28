import React, { useEffect, useState } from "react";
import useFavorites from "../hooks/useFavorites";
import useProducts from "../hooks/useProducts";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Favorites() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const {
    loading: favoritesLoading,
    error: favoritesError,
    getFavorites,
    removeFavorite,
  } = useFavorites();
  const { loading: productsLoading, error: productsError } = useProducts();
  const navigate = useNavigate();

  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    const fetchAndFilterFavorites = async () => {
      try {
        const fetchedFavorites = await getFavorites();
        setFavoriteProducts(fetchedFavorites || []);
      } catch (err) {
        console.error("Gagal mengambil favorit:", err);
        toast.error("Gagal memuat favorit: " + err.message);
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchAndFilterFavorites();
      }
    }
  }, [getFavorites, user, authLoading, navigate]);

  const handleRemoveFavorite = async (productId) => {
    if (!user) {
      toast.error("Silakan login untuk menghapus dari favorit.");
      return;
    }
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus produk ini dari favorit?"
      )
    ) {
      try {
        await removeFavorite(productId);
        setFavoriteProducts((prev) => prev.filter((p) => p.id !== productId));
        toast.success("Produk berhasil dihapus dari favorit!");
      } catch (err) {
        toast.error(`Gagal menghapus favorit: ${err.message}`);
      }
    }
  };

  if (authLoading || favoritesLoading || productsLoading)
    return <div className="p-8 text-center">Memuat favorit...</div>;
  if (authError || favoritesError || productsError)
    return (
      <div className="p-8 text-center text-red-600">
        Error memuat favorit: {authError || favoritesError || productsError}
      </div>
    );
  if (!user) return null;

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">Favorit Saya</h1>
      <p className="mb-6 text-gray-600">
        Produk-produk yang Anda tandai sebagai favorit.
      </p>

      {favoriteProducts.length === 0 ? (
        <p className="text-gray-500">Belum ada produk favorit.</p>
      ) : (
        <div className="sm:grid-cols-2 md:grid-cols-3 grid grid-cols-1 gap-6">
          {favoriteProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-xl hover:shadow-lg p-4 transition bg-white shadow-md"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="object-cover w-full h-48 mb-3 rounded-md"
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h2>
              <p className="mb-1 text-sm text-gray-500">{product.brand_id}</p>
              <p className="mb-2 font-semibold text-orange-500">
                Rp {parseFloat(product.price).toLocaleString("id-ID")}
              </p>
              <button
                onClick={() => handleRemoveFavorite(product.id)}
                className="hover:bg-red-600 px-4 py-2 text-sm text-white bg-red-500 rounded-md"
              >
                Hapus dari Favorit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
