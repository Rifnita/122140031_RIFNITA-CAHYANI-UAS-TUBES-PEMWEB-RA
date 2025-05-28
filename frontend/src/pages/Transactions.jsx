import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useTransactions from "../hooks/useTransactions";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function Transactions() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const {
    loading: transactionsLoading,
    error: transactionsError,
    getTransactions,
    deleteTransaction,
  } = useTransactions();
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const fetchedTransactions = await getTransactions();
        setTransactions(fetchedTransactions || []);
      } catch (err) {
        console.error("Gagal mengambil transaksi:", err);
        toast.error("Gagal memuat transaksi: " + err.message);
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchTransactions();
      }
    }
  }, [getTransactions, user, authLoading, navigate]);

  const handleDelete = async (id) => {
    if (!user) {
      toast.error("Silakan login untuk menghapus transaksi.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        await deleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        toast.success("Transaksi berhasil dihapus!");
      } catch (err) {
        toast.error(`Gagal menghapus transaksi: ${err.message}`);
      }
    }
  };

  if (authLoading || transactionsLoading)
    return <div className="p-8 text-center">Memuat transaksi...</div>;
  if (authError || transactionsError)
    return (
      <div className="p-8 text-center text-red-600">
        Error: {authError || transactionsError}
      </div>
    );
  if (!user) return null;

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Riwayat Transaksi
      </h1>

      {transactions.length === 0 ? (
        <p className="text-gray-600">Belum ada transaksi yang dilakukan.</p>
      ) : (
        <div className="space-y-6">
          {transactions.map((t) => (
            <div key={t.id} className="rounded-xl p-4 bg-white shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-lg font-semibold">
                    {t.product?.name || "Produk Tidak Ditemukan"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ukuran: {t.purchased_size} | Warna: {t.purchased_color}
                  </p>
                  <p className="text-sm text-gray-600">
                    Metode: {t.payment_method}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        t.transaction_status === "Berhasil"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {t.transaction_status}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Tanggal: {new Date(t.transaction_date).toLocaleString()}
                  </p>
                </div>
                {t.product?.image_url && (
                  <img
                    src={t.product.image_url}
                    alt={t.product.name}
                    className="object-cover w-24 h-24 rounded-md"
                  />
                )}
              </div>
              <div className="flex justify-between mt-3">
                <Link
                  to="/invoice"
                  state={{ transaction: t }}
                  className="hover:bg-blue-600 px-4 py-1 text-sm text-white bg-blue-500 rounded"
                >
                  Lihat Faktur
                </Link>
                {t.transaction_status === "Menunggu Pembayaran" && (
                  <Link
                    to="/payment"
                    state={{ transaction: t }}
                    className="hover:bg-orange-600 px-4 py-1 text-sm text-white bg-orange-500 rounded"
                  >
                    Bayar Sekarang
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(t.id)}
                  className="hover:bg-red-600 px-4 py-1 text-sm text-white bg-red-500 rounded"
                >
                  Hapus Transaksi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
