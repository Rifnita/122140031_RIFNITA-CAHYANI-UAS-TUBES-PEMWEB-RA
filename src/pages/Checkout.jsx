// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    method: 'Transfer Bank',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pembelian berhasil!\n\nNama: ${formData.name}\nAlamat: ${formData.address}\nMetode: ${formData.method}\nProduk: ${product.name}`);
    navigate('/dashboard');
  };

  if (!product) {
    return <div className="p-8 text-red-600">Produk tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-nude p-8 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl flex flex-col md:flex-row gap-8">
        {/* Info Produk */}
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover rounded-md mb-4"
          />
          <h2 className="text-xl font-bold mb-1">{product.name}</h2>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="text-orange-500 font-bold text-lg mb-4">Rp {product.price}</p>
        </div>

        {/* Form Pembelian */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Alamat</label>
            <textarea
              name="address"
              required
              rows="3"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            ></textarea>
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Metode Pembayaran</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option>Transfer Bank</option>
              <option>QRIS</option>
              <option>COD</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
          >
            Konfirmasi Pembelian
          </button>
        </form>
      </div>
    </div>
  );
}
