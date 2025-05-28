import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useTransactions from "../hooks/useTransactions";
import useProducts from "../hooks/useProducts";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function Checkout() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  const { createTransaction } = useTransactions();
  const { getProductById } = useProducts();

  const [formData, setFormData] = useState({
    customer_name: "",
    shipping_address: "",
    payment_method: "Transfer Bank",
    purchased_size: "",
    purchased_color: "",
  });
  const [currentProductStock, setCurrentProductStock] = useState(
    product?.stock
  );

  useEffect(() => {
    const fetchLatestStock = async () => {
      if (product?.id) {
        try {
          const latestProduct = await getProductById(product.id);
          if (latestProduct) {
            setCurrentProductStock(latestProduct.stock);
          }
        } catch (err) {
          console.error("Gagal mengambil stok produk terbaru:", err);
          toast.error(
            "Gagal mendapatkan informasi produk terbaru. Silakan coba lagi."
          );
          navigate(-1);
        }
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchLatestStock();
      }
    }
  }, [product?.id, getProductById, navigate, user, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Silakan login untuk menyelesaikan pembelian.");
      navigate("/");
      return;
    }

    if (!product || currentProductStock <= 0) {
      toast.error(
        "Stok produk tidak tersedia atau informasi produk tidak lengkap."
      );
      return;
    }

    try {
      if (currentProductStock <= 0) {
        toast.error("Produk ini sudah habis stok.");
        return;
      }

      const transactionData = {
        product_id: product.id,
        customer_name: formData.customer_name,
        shipping_address: formData.shipping_address,
        payment_method: formData.payment_method,
        purchased_size: formData.purchased_size,
        purchased_color: formData.purchased_color,
      };

      const newTransaction = await createTransaction(transactionData);
      toast.success("Transaksi berhasil dibuat!");
      navigate("/payment", { state: { transaction: newTransaction } });
    } catch (err) {
      console.error("Gagal membuat transaksi:", err);
      toast.error("Gagal membuat transaksi: " + err.message);
    }
  };

  if (authLoading) {
    return <div className="p-8 text-center">Memuat checkout...</div>;
  }
  if (authError) {
    return (
      <div className="p-8 text-center text-red-600">Error: {authError}</div>
    );
  }
  if (!user) {
    return null;
  }
  if (!product) {
    return (
      <div className="p-8 text-red-600">
        Produk tidak ditemukan atau tidak dipilih.
      </div>
    );
  }
  if (currentProductStock === undefined) {
    return <div className="p-8 text-center">Memeriksa stok produk...</div>;
  }

  return (
    <div className="bg-nude flex justify-center min-h-screen p-8">
      <div className="md:flex-row flex flex-col w-full max-w-3xl gap-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex-1">
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-64 mb-4 rounded-md"
          />
          <h2 className="mb-1 text-xl font-bold">{product.name}</h2>
          <p className="mb-2 text-gray-600">{product.description}</p>
          <p className="mb-4 text-lg font-bold text-orange-500">
            Rp {parseFloat(product.price).toLocaleString("id-ID")}
          </p>
          <p
            className={`text-sm ${
              currentProductStock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            Stok: {currentProductStock} {currentProductStock <= 0 && "(Habis!)"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="customer_name"
              required
              value={formData.customer_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Alamat Pengiriman
            </label>
            <textarea
              name="shipping_address"
              required
              rows="3"
              value={formData.shipping_address}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Ukuran</label>
            <select
              name="purchased_size"
              value={formData.purchased_size}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Pilih Ukuran</option>
              {product.sizes?.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Warna</label>
            <select
              name="purchased_color"
              value={formData.purchased_color}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Pilih Warna</option>
              {product.colors?.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Metode Pembayaran
            </label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option>Transfer Bank</option>
              <option>QRIS</option>
              <option>COD</option>
            </select>
          </div>
          <button
            type="submit"
            className="hover:bg-green-600 w-full py-2 text-white bg-green-500 rounded-md"
            disabled={currentProductStock <= 0}
          >
            {currentProductStock <= 0 ? "Stok Habis" : "Konfirmasi Pembelian"}
          </button>
        </form>
      </div>
    </div>
  );
}
