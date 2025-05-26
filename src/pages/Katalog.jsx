// src/pages/Katalog.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Katalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  return (
    <div className="min-h-screen bg-nude p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Katalog Produk</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
            <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
            <p className="text-orange-500 font-semibold mb-2">Rp {product.price}</p>
            <p className="text-sm text-gray-600 mb-2">Stok: {product.stock}</p>
            <div className="flex justify-between mt-2">
              <Link
                to={`/product/${product.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Lihat Detail
              </Link>
              <Link
                to="/checkout"
                state={{ product }}
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
              >
                Beli
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
