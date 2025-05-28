import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useProducts from "../hooks/useProducts";
import useBrands from "../hooks/useBrands";
import useInspirations from "../hooks/useInspirations";
import useFavorites from "../hooks/useFavorites";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, loading: authLoading, error: authError, isAdmin } = useAuth();
  const {
    loading: productsLoading,
    error: productsError,
    getProducts,
  } = useProducts();
  const { loading: brandsLoading, error: brandsError, getBrands } = useBrands();
  const {
    loading: inspirationsLoading,
    error: inspirationsError,
    getInspirations,
  } = useInspirations();
  const {
    loading: favoritesLoading,
    error: favoritesError,
    getFavorites,
    addFavorite,
    removeFavorite,
  } = useFavorites();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [inspirationsCount, setInspirationsCount] = useState(0);
  const [brandsCount, setBrandsCount] = useState(0);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts || []);
      } catch (err) {
        console.error("Gagal mengambil produk:", err);
        toast.error("Gagal memuat produk: " + err.message);
      }

      try {
        const fetchedBrands = await getBrands();
        setBrands(fetchedBrands || []);
        setBrandsCount(fetchedBrands?.length || 0);
      } catch (err) {
        console.error("Gagal mengambil merek:", err);
        toast.error("Gagal memuat merek: " + err.message);
      }

      try {
        const fetchedInspirations = await getInspirations();
        setInspirationsCount(fetchedInspirations?.length || 0);
      } catch (err) {
        console.error("Gagal mengambil inspirasi:", err);
        toast.error("Gagal memuat inspirasi: " + err.message);
      }

      if (user) {
        try {
          const fetchedFavorites = await getFavorites();
          setFavorites(
            fetchedFavorites ? fetchedFavorites.map((fav) => fav.id) : []
          );
        } catch (err) {
          console.error("Gagal mengambil favorit:", err);
          toast.error("Gagal memuat favorit: " + err.message);
        }
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchData();
      }
    }
  }, [
    user,
    authLoading,
    getProducts,
    getBrands,
    getInspirations,
    getFavorites,
    navigate,
  ]);

  const toggleFavorite = async (productId) => {
    if (!user) {
      toast.error("Silakan login untuk menambahkan ke favorit.");
      return;
    }
    try {
      if (favorites.includes(productId)) {
        await removeFavorite(productId);
        setFavorites((prev) => prev.filter((id) => id !== productId));
        toast.success("Produk dihapus dari favorit!");
      } else {
        await addFavorite(productId);
        setFavorites((prev) => [...prev, productId]);
        toast.success("Produk ditambahkan ke favorit!");
      }
    } catch (err) {
      toast.error(`Gagal memperbarui favorit: ${err.message}`);
    }
  };

  if (
    authLoading ||
    productsLoading ||
    brandsLoading ||
    inspirationsLoading ||
    favoritesLoading
  )
    return <div className="p-8 text-center">Memuat data dashboard...</div>;
  if (
    authError ||
    productsError ||
    brandsError ||
    inspirationsError ||
    favoritesError
  )
    return (
      <div className="p-8 text-center text-red-600">
        Error memuat dashboard:{" "}
        {authError ||
          productsError ||
          brandsError ||
          inspirationsError ||
          favoritesError}
      </div>
    );
  if (!user) return null;

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-4 text-3xl font-bold text-center text-gray-800">
        Selamat Datang{" "}
        <span className="text-orange-500">
          {isAdmin ? "Admin" : "Wearspace Outfitly"}
        </span>
      </h1>
      <p className="mb-10 text-center text-gray-600">
        Kelola produk, merek, dan inspirasi fashion kamu dengan mudah!
      </p>

      {isAdmin && (
        <div className="md:grid-cols-3 grid grid-cols-1 gap-6 mb-10">
          <div className="rounded-xl p-6 text-center bg-white shadow">
            <p className="mb-1 text-gray-600">Total Produk</p>
            <p className="text-2xl font-bold text-orange-500">
              {products.length}
            </p>
          </div>
          <div className="rounded-xl p-6 text-center bg-white shadow">
            <p className="mb-1 text-gray-600">Total Merek</p>
            <p className="text-2xl font-bold text-orange-500">
              {brands.length}
            </p>
          </div>
          <div className="rounded-xl p-6 text-center bg-white shadow">
            <p className="mb-1 text-gray-600">Inspirasi Fashion</p>
            <p className="text-2xl font-bold text-orange-500">
              {inspirationsCount}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mb-10">
        {isAdmin && (
          <>
            <Link
              to="/products"
              className="hover:bg-orange-600 px-6 py-3 font-medium text-white bg-orange-500 rounded-md"
            >
              Kelola Produk
            </Link>
            <Link
              to="/brands"
              className="hover:bg-orange-600 px-6 py-3 font-medium text-white bg-orange-500 rounded-md"
            >
              Kelola Merek
            </Link>
          </>
        )}
        <Link
          to="/inspirations"
          className="hover:bg-orange-600 px-6 py-3 font-medium text-white bg-orange-500 rounded-md"
        >
          Lihat Inspirasi
        </Link>
      </div>

      <h2 className="mb-4 text-2xl font-bold text-gray-800">Katalog Produk</h2>
      <div className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid grid-cols-1 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl relative p-4 bg-white shadow"
          >
            <div className="top-3 right-3 absolute text-xl text-red-500 cursor-pointer">
              {favorites.includes(product.id) ? (
                <FaHeart onClick={() => toggleFavorite(product.id)} />
              ) : (
                <FaRegHeart onClick={() => toggleFavorite(product.id)} />
              )}
            </div>

            <img
              src={product.image_url}
              alt={product.name}
              className="object-contain w-full h-48 mb-3 rounded-md"
            />
            <h3 className="mb-1 text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="mb-2 text-sm text-gray-600">
              Merek:{" "}
              {brands.find((b) => b.id === product.brand_id)?.name || "N/A"}
            </p>
            <p className="mb-2 font-semibold text-orange-500">
              Rp {parseFloat(product.price).toLocaleString("id-ID")}
            </p>
            <div className="flex justify-between">
              <Link
                to={`/product/${product.id}`}
                className="text-sm text-blue-600"
              >
                Detail
              </Link>
              <Link
                to="/checkout"
                state={{ product }}
                className="hover:bg-green-600 px-4 py-1 text-sm text-white bg-green-500 rounded"
              >
                Beli
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
