<<<<<<< HEAD
import React, { useEffect, useState } from 'react';

export default function Favorites() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const filtered = storedProducts.filter(product =>
      storedFavorites.includes(product.id)
    );

    setFavoriteProducts(filtered);
  }, []);

  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favoriteProducts.filter(p => p.id !== id);
    setFavoriteProducts(updatedFavorites);
    localStorage.setItem(
      'favorites',
      JSON.stringify(updatedFavorites.map(p => p.id))
    );
  };

=======
import React from 'react';

const favoriteProducts = [
  {
    id: 1,
    name: 'Kemeja Linen',
    brand: 'ZARA',
    price: '249.000',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Jaket Oversize',
    brand: 'Pull&Bear',
    price: '399.000',
    image: 'https://via.placeholder.com/150',
  },
];

export default function Favorites() {
>>>>>>> efaa580b454fae0aebd62b00175b0703e383c994
  return (
    <div className="min-h-screen bg-nude p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Favorit Saya</h1>
      <p className="text-gray-600 mb-6">Produk-produk yang Anda tandai sebagai favorit.</p>

<<<<<<< HEAD
      {favoriteProducts.length === 0 ? (
        <p className="text-gray-500">Belum ada produk favorit.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoriteProducts.map((product) => (
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
              <button
                onClick={() => handleRemoveFavorite(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Hapus dari Favorit
              </button>
            </div>
          ))}
        </div>
      )}
=======
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {favoriteProducts.map((product) => (
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
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm">
              Hapus dari Favorit
            </button>
          </div>
        ))}
      </div>
>>>>>>> efaa580b454fae0aebd62b00175b0703e383c994
    </div>
  );
}
