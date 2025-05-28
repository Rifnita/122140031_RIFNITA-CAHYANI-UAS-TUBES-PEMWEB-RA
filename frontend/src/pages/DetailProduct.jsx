import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import useBrands from "../hooks/useBrands";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function DetailProduct() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loading: productLoading,
    error: productError,
    getProductById,
  } = useProducts();
  const { loading: brandsLoading, error: brandsError, getBrands } = useBrands();

  const [product, setProduct] = useState(null);
  const [brandName, setBrandName] = useState("N/A");

  useEffect(() => {
    const fetchDetailsAndBrand = async () => {
      try {
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);

        if (fetchedProduct?.brand_id) {
          try {
            const fetchedBrands = await getBrands();
            const foundBrand = fetchedBrands?.find(
              (b) => b.id === fetchedProduct.brand_id
            );
            if (foundBrand) {
              setBrandName(foundBrand.name);
            }
          } catch (err) {
            console.error("Gagal mengambil merek terkait produk:", err);
            toast.error("Gagal memuat data merek: " + err.message);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil detail produk:", err);
        toast.error("Gagal memuat detail produk: " + err.message);
      }
    };

    if (!authLoading) {
      fetchDetailsAndBrand();
    }
  }, [id, getProductById, getBrands, authLoading]); // Tambahkan getBrands ke dependensi

  // Hapus useEffect terpisah untuk fetchBrand karena sudah digabungkan di atas.
  // useEffect(() => {
  //   const fetchBrand = async () => { /* ... */ };
  //   if (product && !brandsLoading) {
  //     fetchBrand();
  //   }
  // }, [product, getBrands, brandsLoading]);

  if (authLoading || productLoading || brandsLoading)
    return <div className="p-8 text-center">Memuat detail produk...</div>;
  if (authError || productError || brandsError)
    return (
      <div className="p-8 text-center text-red-600">
        Error memuat produk: {authError || productError || brandsError}
      </div>
    );
  if (!product)
    return (
      <div className="p-8 text-center text-gray-600">
        Produk tidak ditemukan.
      </div>
    );

  return (
    <div className="bg-nude min-h-screen p-8">
      <div className="md:flex-row flex flex-col gap-8">
        <div className="md:w-1/2 w-full">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        <div className="md:w-1/2 w-full">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            {product.name}
          </h2>
          <p className="mb-2 text-sm text-gray-600">Merek: {brandName}</p>
          <p className="mb-4 text-xl font-semibold text-orange-500">
            Rp {parseFloat(product.price).toLocaleString("id-ID")}
          </p>
          <p className="mb-4 text-gray-700">{product.description}</p>

          <div className="mb-4">
            <p className="mb-1 font-semibold">Ukuran Tersedia:</p>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 text-sm border rounded-md"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-1 font-semibold">Warna:</p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 text-sm border rounded-md"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          <p className="mb-2 text-sm text-gray-600">
            Bahan: {product.material}
          </p>
          <p className="mb-2 text-sm text-gray-600">
            Kategori: {product.category}
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Stok tersedia: {product.stock}
          </p>
          {user ? (
            <Link
              to="/checkout"
              state={{ product }}
              className="hover:bg-green-600 px-6 py-3 text-lg text-white bg-green-500 rounded-md"
            >
              Beli Sekarang
            </Link>
          ) : (
            <button
              onClick={() => {
                toast.info("Silakan login untuk membeli produk.");
                navigate("/login");
              }}
              className="hover:bg-blue-600 px-6 py-3 text-lg text-white bg-blue-500 rounded-md"
            >
              Login untuk Beli
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
