import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import useBrands from "../hooks/useBrands";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function Katalog() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();
  const {
    loading: productsLoading,
    error: productsError,
    getProducts,
  } = useProducts();
  const { loading: brandsLoading, error: brandsError, getBrands } = useBrands();

  const [products, setProducts] = useState([]);
  const [brandsMap, setBrandsMap] = useState({});

  useEffect(() => {
    const fetchCatalogData = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts || []);
      } catch (err) {
        console.error("Gagal mengambil produk untuk katalog:", err);
        toast.error("Gagal memuat produk: " + err.message);
      }

      try {
        const fetchedBrands = await getBrands();
        const map = {};
        fetchedBrands?.forEach((brand) => {
          map[brand.id] = brand.name;
        });
        setBrandsMap(map);
      } catch (err) {
        console.error("Gagal mengambil merek untuk katalog:", err);
        toast.error("Gagal memuat merek: " + err.message);
      }
    };
    if (!authLoading) {
      fetchCatalogData();
    }
  }, [getProducts, getBrands, authLoading]);

  if (authLoading || productsLoading || brandsLoading)
    return (
      <div className="bg-nude min-h-screen p-8 text-center">
        Memuat katalog...
      </div>
    );
  if (authError || productsError || brandsError)
    return (
      <div className="bg-nude min-h-screen p-8 text-center text-red-600">
        Error memuat produk: {authError || productsError || brandsError}
      </div>
    );

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
        Katalog Produk
      </h1>
      <div className="sm:grid-cols-2 md:grid-cols-3 grid grid-cols-1 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl hover:shadow-lg p-4 transition bg-white shadow-md"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="object-contain w-full h-48 mb-3 rounded-md"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="mb-1 text-sm text-gray-500">
              Merek: {brandsMap[product.brand_id] || "N/A"}
            </p>
            <p className="mb-2 font-semibold text-orange-500">
              Rp {parseFloat(product.price).toLocaleString("id-ID")}
            </p>
            <p className="mb-2 text-sm text-gray-600">Stok: {product.stock}</p>
            <div className="flex justify-between mt-2">
              <Link
                to={`/product/${product.id}`}
                className="hover:underline text-sm text-blue-600"
              >
                Lihat Detail
              </Link>
              {user ? (
                <Link
                  to="/checkout"
                  state={{ product }}
                  className="hover:bg-green-600 px-3 py-1 text-sm text-white bg-green-500 rounded"
                >
                  Beli
                </Link>
              ) : (
                <button
                  onClick={() => {
                    toast.info("Silakan login untuk membeli produk.");
                    navigate("/login");
                  }}
                  className="hover:bg-blue-600 px-3 py-1 text-sm text-white bg-blue-500 rounded"
                >
                  Login untuk Beli
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
