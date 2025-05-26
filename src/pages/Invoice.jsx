// src/pages/Invoice.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Invoice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const transaction = state?.transaction;

  if (!transaction) {
    return <div className="p-8 text-red-600">Data transaksi tidak ditemukan.</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-nude p-8">
      <div className="bg-white shadow-md rounded-lg max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Invoice Transaksi</h1>
        <p className="mb-2"><strong>Nama:</strong> {transaction.name}</p>
        <p className="mb-2"><strong>Alamat:</strong> {transaction.address}</p>
        <p className="mb-2"><strong>Metode Pembayaran:</strong> {transaction.method}</p>
        <p className="mb-2"><strong>Status:</strong> {transaction.status}</p>
        <p className="mb-4"><strong>Tanggal:</strong> {transaction.timestamp}</p>

        <hr className="my-4" />

        <div className="flex gap-4">
          <img
            src={transaction.product?.image}
            alt={transaction.product?.name}
            className="w-32 h-32 object-cover rounded-md"
          />
          <div>
            <p className="font-semibold text-lg">{transaction.product?.name}</p>
            <p className="text-sm text-gray-500">Brand: {transaction.product?.brand}</p>
            <p className="text-sm">Ukuran: {transaction.size}</p>
            <p className="text-sm">Warna: {transaction.color}</p>
            <p className="text-orange-500 font-bold mt-2">Rp {transaction.product?.price}</p>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate('/transactions')}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Kembali
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Cetak Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
