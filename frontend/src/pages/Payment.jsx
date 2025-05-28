import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useTransactions from "../hooks/useTransactions";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function Payment() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialTransaction = state?.transaction;

  const { updateTransactionStatus, getTransactionById } = useTransactions();
  const [transaction, setTransaction] = useState(initialTransaction);

  useEffect(() => {
    const fetchLatestTransaction = async () => {
      if (initialTransaction?.id) {
        try {
          const fetchedTransaction = await getTransactionById(
            initialTransaction.id
          );
          if (fetchedTransaction) {
            setTransaction(fetchedTransaction);
          }
        } catch (err) {
          console.error(
            "Gagal mengambil detail transaksi untuk pembayaran:",
            err
          );
          toast.error("Gagal memuat detail pembayaran. Silakan coba lagi.");
          navigate("/transactions");
        }
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else if (!initialTransaction) {
        navigate("/transactions");
      } else {
        fetchLatestTransaction();
      }
    }
  }, [initialTransaction, getTransactionById, navigate, user, authLoading]);

  const handleSuccess = async () => {
    if (!user) {
      toast.error("Silakan login untuk mengkonfirmasi pembayaran.");
      navigate("/");
      return;
    }
    if (!transaction) return;
    try {
      await updateTransactionStatus(transaction.id, "Berhasil");
      toast.success("Pembayaran berhasil dikonfirmasi!");
      navigate("/success");
    } catch (err) {
      toast.error(`Gagal memperbarui status pembayaran: ${err.message}`);
    }
  };

  if (authLoading) {
    return <div className="p-8 text-center">Memuat detail pembayaran...</div>;
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
    return <div className="p-8 text-red-600">Transaksi tidak ditemukan.</div>;
  }

  return (
    <div className="bg-nude flex justify-center min-h-screen p-8">
      <div className="w-full max-w-xl p-6 bg-white rounded-md shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Pembayaran</h1>

        <p className="mb-4">
          Total yang harus dibayar:{" "}
          <strong>
            Rp {parseFloat(transaction.product?.price).toLocaleString("id-ID")}
          </strong>
        </p>

        {transaction.payment_method === "QRIS" ? (
          <div className="text-center">
            <img src="/qris-example.png" alt="QRIS" className="w-64 mx-auto" />
            <p className="mt-2 text-sm text-gray-600">
              Pindai kode QR untuk menyelesaikan pembayaran
            </p>
          </div>
        ) : transaction.payment_method === "Transfer Bank" ? (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Pilih Bank
              </label>
              <select className="w-full p-2 border rounded-md">
                <option>Bank BRI</option>
                <option>Bank BCA</option>
                <option>Bank Mandiri</option>
                <option>Bank BNI</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Silakan transfer ke: <strong>123-456-7890</strong> a.n Wearspace
              Outfitly
            </div>
          </div>
        ) : (
          <p className="text-gray-600">
            Silakan bayar di tempat saat produk sampai (COD).
          </p>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/invoice", { state: { transaction } })}
            className="hover:bg-blue-600 px-4 py-2 text-white bg-blue-500 rounded-md"
          >
            Lihat Faktur
          </button>
          <button
            onClick={handleSuccess}
            className="hover:bg-green-600 px-4 py-2 text-white bg-green-500 rounded-md"
          >
            Saya Sudah Bayar
          </button>
        </div>
      </div>
    </div>
  );
}
