import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const allTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const transaction = allTransactions.find((t) => String(t.id) === String(id));

  if (!transaction) {
    return (
      <div className="min-h-screen bg-nude p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Transaksi tidak ditemukan</h1>
        <button
          onClick={() => navigate('/transactions')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nude p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Detail Transaksi</h1>
      <div className="bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto">
        <p className="mb-2"><strong>Nama:</strong> {transaction.name}</p>
        <p className="mb-2"><strong>Alamat:</strong> {transaction.address}</p>
        <p className="mb-2"><strong>Metode Pembayaran:</strong> {transaction.method}</p>
        <p className="mb-2"><strong>Tanggal:</strong> {transaction.timestamp}</p>

        <hr className="my-4" />
        <h2 className="text-xl font-semibold mb-3">Produk</h2>

        <div className="flex items-center gap-4">
          {transaction.product?.image && (
            <img
              src={transaction.product.image}
              alt={transaction.product.name}
              className="w-32 h-32 object-cover rounded-md"
            />
          )}
          <div>
            <p className="font-semibold text-lg">{transaction.product?.name}</p>
            <p className="text-sm text-gray-500">Brand: {transaction.product?.brand}</p>
            <p className="text-sm">Ukuran: {transaction.size}</p>
            <p className="text-sm">Warna: {transaction.color}</p>
            <p className="text-orange-500 font-bold mt-2">Rp {transaction.product?.price}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/transactions')}
          className="mt-6 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Kembali ke Riwayat
        </button>
      </div>
    </div>
  );
}
