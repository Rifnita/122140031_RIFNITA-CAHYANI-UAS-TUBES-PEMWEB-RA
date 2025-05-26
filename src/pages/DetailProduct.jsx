// src/pages/DetailProduct.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

export default function DetailProduct() {
  const { id } = useParams();

  // Simulasi data produk (nanti bisa ambil dari props atau API)
  const product = {
    id,
    name: 'Kemeja Linen',
    brand: 'ZARA',
    price: '249.000',
    description: 'Kemeja bahan linen premium cocok untuk acara formal maupun santai.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Hitam', 'Putih', 'Navy'],
    stock: 12,
    material: 'Linen',
    category: 'Casual',
    image: 'https://via.placeholder.com/400x400',
  };

  return (
    <div className="min-h-screen bg-nude p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h2>
          <p className="text-sm text-gray-600 mb-2">Brand: {product.brand}</p>
          <p className="text-xl text-orange-500 font-semibold mb-4">Rp {product.price}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="mb-4">
            <p className="font-semibold mb-1">Ukuran Tersedia:</p>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <span key={size} className="px-3 py-1 border rounded-md text-sm">
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="font-semibold mb-1">Warna:</p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <span key={color} className="px-3 py-1 border rounded-md text-sm">
                  {color}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-2">Bahan: {product.material}</p>
          <p className="text-sm text-gray-600 mb-2">Kategori: {product.category}</p>
          <p className="text-sm text-gray-600 mb-6">Stok tersedia: {product.stock}</p>
        </div>
      </div>
    </div>
  );
}