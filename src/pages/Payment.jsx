import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const id = state?.id;

  const allTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const transaction = allTransactions.find(t => t.id === id);

  if (!transaction) {
    return <div className="p-8 text-red-600">Transaksi tidak ditemukan.</div>;
  }

  const handleSuccess = () => {
    const updated = allTransactions.map(t =>
      t.id === id ? { ...t, status: 'Berhasil' } : t
    );
    localStorage.setItem('transactions', JSON.stringify(updated));
    navigate('/success');
  };

  return (
    <div className="min-h-screen bg-nude p-8 flex justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Pembayaran</h1>

        {transaction.method === 'QRIS' ? (
          <div className="text-center">
            <img src="/qris-example.png" alt="QRIS" className="mx-auto w-64" />
            <p className="text-sm text-gray-600 mt-2">Scan kode QR untuk menyelesaikan pembayaran</p>
          </div>
        ) : transaction.method === 'Transfer Bank' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Bank</label>
              <select className="w-full border p-2 rounded-md">
                <option>Bank BRI</option>
                <option>Bank BCA</option>
                <option>Bank Mandiri</option>
                <option>Bank BNI</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Silakan transfer ke: <strong>123-456-7890</strong> a.n Wearspace Outfitly
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Silakan bayar di tempat saat produk sampai.</p>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate('/invoice', { state: { id } })}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Lihat Invoice
          </button>
          <button
            onClick={handleSuccess}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Saya Sudah Bayar
          </button>
        </div>
      </div>
    </div>
  );
}
