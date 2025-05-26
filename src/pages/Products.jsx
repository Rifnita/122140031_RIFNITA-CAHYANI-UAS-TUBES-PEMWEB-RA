import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const initialProducts = [
  {
    id: 1,
    name: 'Kemeja Linen',
    brand: 'ZARA',
    price: '249.000',
    stock: 12,
    sizes: 'S, M, L, XL',
    image: 'https://via.placeholder.com/150',
  },
];

const getStoredProducts = () => {
  const stored = localStorage.getItem('products');
  return stored ? JSON.parse(stored) : initialProducts;
};

export default function Products() {
  const [products, setProducts] = useState(getStoredProducts());
  const [brands, setBrands] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    price: '',
    stock: '',
    sizes: '',
    image: '',
  });
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedBrands = JSON.parse(localStorage.getItem('brands')) || [];
    setBrands(storedBrands);
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleEditClick = (product) => {
    setEditId(product.id);
    setEditData(product);
  };

  const handleChange = (e, isNew = false) => {
    const { name, value } = e.target;
    if (isNew) {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    setProducts((prev) =>
      prev.map((p) => (p.id === editId ? { ...p, ...editData } : p))
    );
    setEditId(null);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddProduct = () => {
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { id: newId, ...newProduct }]);
    setNewProduct({ name: '', brand: '', price: '', stock: '', sizes: '', image: '' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-nude p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Produk</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md shadow-md transition"
        >
          {showAddForm ? 'Tutup Form' : '+ Tambah Produk'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Form Tambah Produk</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={(e) => handleChange(e, true)}
              placeholder="Nama Produk"
              className="border p-2 rounded-md"
            />
            <select
              name="brand"
              value={newProduct.brand}
              onChange={(e) => handleChange(e, true)}
              className="border p-2 rounded-md"
            >
              <option value="">Pilih Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
            <input
              type="text"
              name="price"
              value={newProduct.price}
              onChange={(e) => handleChange(e, true)}
              placeholder="Harga"
              className="border p-2 rounded-md"
            />
            <input
              type="text"
              name="stock"
              value={newProduct.stock}
              onChange={(e) => handleChange(e, true)}
              placeholder="Stok"
              className="border p-2 rounded-md"
            />
            <input
              type="text"
              name="sizes"
              value={newProduct.sizes}
              onChange={(e) => handleChange(e, true)}
              placeholder="Ukuran (contoh: S, M, L)"
              className="border p-2 rounded-md"
            />
            <input
              type="text"
              name="image"
              value={newProduct.image}
              onChange={(e) => handleChange(e, true)}
              placeholder="URL Gambar"
              className="border p-2 rounded-md"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Simpan Produk
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="absolute top-3 right-3 text-red-500 cursor-pointer text-lg">
              {favorites.includes(product.id) ? (
                <FaHeart onClick={() => toggleFavorite(product.id)} />
              ) : (
                <FaRegHeart onClick={() => toggleFavorite(product.id)} />
              )}
            </div>

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-3"
            />

            {editId === product.id ? (
              <>
                {['name', 'brand', 'price', 'stock', 'sizes'].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={editData[field]}
                    onChange={handleChange}
                    className="w-full border p-1 mb-1 rounded"
                  />
                ))}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Batal
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                <p className="text-orange-500 font-semibold mb-2">Rp {product.price}</p>
                <p className="text-sm text-gray-600">Stok: {product.stock}</p>
                <p className="text-sm text-gray-600">Ukuran: {product.sizes}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
