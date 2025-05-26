import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

export default function Success() {
  return (
    <div className="min-h-screen bg-nude flex flex-col justify-center items-center text-center p-8">
      <FaCheckCircle className="text-green-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Transaksi Berhasil!</h1>
      <p className="text-gray-600 mb-6">Terima kasih telah berbelanja di Wearspace Outfitly.</p>
      <Link to="/transactions" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md">
        Lihat Riwayat Transaksi
      </Link>
    </div>
  );
}
