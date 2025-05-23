import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ tambahkan useNavigate

const products = [
  {
    id: 1,
    name: 'Kemeja Linen',
    description: 'Kemeja bahan linen premium cocok untuk acara formal maupun santai.',
    price: '249.000',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Celana Chino',
    description: 'Celana chino nyaman untuk aktivitas harian.',
    price: '199.000',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Jaket Oversize',
    description: 'Jaket model oversize, cocok untuk gaya streetwear.',
    price: '399.000',
    image: 'https://via.placeholder.com/150',
  },
];

export default function Dashboard() {
  const navigate = useNavigate(); // ✅ inisialisasi navigate

  return (
    <div className="min-h-screen bg-nude p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Selamat Datang di <span className="text-orange-500">Wearspace Outfitly</span>
      </h1>
      <p className="text-center text-gray-600 mb-10">
        Kelola produk, brand, dan inspirasi fashion kamu dengan mudah!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-600 mb-1">Total Produk</p>
          <p className="text-2xl font-bold text-orange-500">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-600 mb-1">Total Brand</p>
          <p className="text-2xl font-bold text-orange-500">5</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-600 mb-1">Inspirasi Fashion</p>
          <p className="text-2xl font-bold text-orange-500">9</p>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-10">
        <Link to="/products" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium">
          Kelola Produk
        </Link>
        <Link to="/brands" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium">
          Kelola Brand
        </Link>
        <Link to="/inspirations" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium">
          Lihat Inspirasi
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Katalog Produk</h2>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-xl shadow w-72 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <p className="text-orange-500 font-semibold mb-2">Rp {product.price}</p>
              <div className="flex justify-between">
                <Link to={`/product/${product.id}`} className="text-blue-600 text-sm">Detail</Link>
                <button
                  onClick={() => navigate('/checkout', { state: { product } })}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm"
                >
                  Beli
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
