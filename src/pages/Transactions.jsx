import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('transactions')) || [];
    setTransactions(stored);
  }, []);

  const handleDelete = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-nude p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Riwayat Transaksi</h1>

      {transactions.length === 0 ? (
        <p className="text-gray-600">Belum ada transaksi yang dilakukan.</p>
      ) : (
        <div className="space-y-6">
          {transactions.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-lg font-semibold">{t.product.name}</p>
                  <p className="text-sm text-gray-500">Ukuran: {t.size} | Warna: {t.color}</p>
                  <p className="text-sm text-gray-600">Metode: {t.method}</p>
                  <p className="text-sm text-gray-600">
                    Status:{' '}
                    <span className={`font-semibold ${t.status === 'Berhasil' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {t.status}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">{t.timestamp}</p>
                </div>
                <img
                  src={t.product.image}
                  alt={t.product.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
              </div>
              <div className="flex justify-between mt-3">
                <Link
                  to="/invoice"
                  state={{ transaction: t }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
                >
                  Lihat Invoice
                </Link>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
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
