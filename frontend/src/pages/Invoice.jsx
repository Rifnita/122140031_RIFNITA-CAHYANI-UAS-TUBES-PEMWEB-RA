import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Invoice() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const transaction = state?.transaction;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return <div className="p-8 text-center">Memuat faktur...</div>;
  }
  if (authError) {
    return (
      <div className="p-8 text-center text-red-600">Error: {authError}</div>
    );
  }
  if (!user) {
    return null;
  }
  if (!transaction) {
    return (
      <div className="p-8 text-red-600">Data transaksi tidak ditemukan.</div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-nude min-h-screen p-8">
      <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Faktur Transaksi
        </h1>
        <p className="mb-2">
          <strong>ID Transaksi:</strong> {transaction.id}
        </p>
        <p className="mb-2">
          <strong>Nama Pelanggan:</strong> {transaction.customer_name}
        </p>
        <p className="mb-2">
          <strong>Alamat Pengiriman:</strong> {transaction.shipping_address}
        </p>
        <p className="mb-2">
          <strong>Metode Pembayaran:</strong> {transaction.payment_method}
        </p>
        <p className="mb-2">
          <strong>Status:</strong> {transaction.transaction_status}
        </p>
        <p className="mb-4">
          <strong>Tanggal:</strong>{" "}
          {new Date(transaction.transaction_date).toLocaleString()}
        </p>

        <hr className="my-4" />

        <div className="flex gap-4">
          {transaction.product?.image_url && (
            <img
              src={transaction.product.image_url}
              alt={transaction.product.name}
              className="object-cover w-32 h-32 rounded-md"
            />
          )}
          <div>
            <p className="text-lg font-semibold">
              {transaction.product?.name || "Produk Tidak Ditemukan"}
            </p>
            <p className="text-sm text-gray-500">
              ID Merek: {transaction.product?.brand_id || "N/A"}
            </p>
            <p className="text-sm">Ukuran: {transaction.purchased_size}</p>
            <p className="text-sm">Warna: {transaction.purchased_color}</p>
            <p className="mt-2 font-bold text-orange-500">
              Rp{" "}
              {parseFloat(transaction.product?.price).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/transactions")}
            className="hover:bg-gray-500 px-4 py-2 text-white bg-gray-400 rounded-md"
          >
            Kembali
          </button>
          <button
            onClick={handlePrint}
            className="hover:bg-green-600 px-4 py-2 text-white bg-green-500 rounded-md"
          >
            Cetak Faktur
          </button>
        </div>
      </div>
    </div>
  );
}
