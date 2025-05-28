import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTransactions from "../hooks/useTransactions";
import useAuth from "../hooks/useAuth";

export default function TransactionDetail() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loading: transactionsLoading,
    error: transactionsError,
    getTransactionById,
  } = useTransactions();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const fetchedTransaction = await getTransactionById(id);
        setTransaction(fetchedTransaction);
      } catch (err) {
        console.error("Failed to fetch transaction details:", err);
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchTransaction();
      }
    }
  }, [id, getTransactionById, user, authLoading, navigate]);

  if (authLoading || transactionsLoading)
    return (
      <div className="bg-nude min-h-screen p-8">
        <div className="p-8 text-center">Loading transaction details...</div>
      </div>
    );
  if (authError || transactionsError)
    return (
      <div className="bg-nude min-h-screen p-8">
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          Error: {authError || transactionsError}
        </h1>
        <button
          onClick={() => navigate("/transactions")}
          className="hover:bg-orange-600 px-4 py-2 text-white bg-orange-500 rounded-md"
        >
          Kembali
        </button>
      </div>
    );
  if (!user) return null;
  if (!transaction)
    return (
      <div className="bg-nude min-h-screen p-8">
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          Transaksi tidak ditemukan
        </h1>
        <button
          onClick={() => navigate("/transactions")}
          className="hover:bg-orange-600 px-4 py-2 text-white bg-orange-500 rounded-md"
        >
          Kembali
        </button>
      </div>
    );

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Detail Transaksi
      </h1>
      <div className="rounded-xl max-w-xl p-6 mx-auto bg-white shadow-md">
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
        <h2 className="mb-3 text-xl font-semibold">Produk</h2>

        <div className="flex items-center gap-4">
          {transaction.product?.image_url && (
            <img
              src={transaction.product.image_url}
              alt={transaction.product.name}
              className="object-cover w-32 h-32 rounded-md"
            />
          )}
          <div>
            <p className="text-lg font-semibold">
              {transaction.product?.name || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Brand ID: {transaction.product?.brand_id || "N/A"}
            </p>
            <p className="text-sm">Ukuran: {transaction.purchased_size}</p>
            <p className="text-sm">Warna: {transaction.purchased_color}</p>
            <p className="mt-2 font-bold text-orange-500">
              Rp{" "}
              {parseFloat(transaction.product?.price).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/transactions")}
          className="hover:bg-gray-500 px-4 py-2 mt-6 text-white bg-gray-400 rounded-md"
        >
          Kembali ke Riwayat
        </button>
      </div>
    </div>
  );
}
