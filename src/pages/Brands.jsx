import React, { useState, useEffect } from 'react';

export default function Brands() {
  const [brands, setBrands] = useState(() => {
    const saved = localStorage.getItem('brands');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'ZARA',
        items: [
          { id: 1, name: 'Kemeja Linen', size: 'M', stock: 10 },
          { id: 2, name: 'Blazer Wanita', size: 'L', stock: 5 },
        ],
      },
      {
        id: 2,
        name: 'H&M',
        items: [
          { id: 1, name: 'Kaos Oversize', size: 'M', stock: 7 },
          { id: 2, name: 'Kaos Croptop', size: 'S', stock: 4 },
        ],
      },
      {
        id: 3,
        name: 'Pull&Bear',
        items: [],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('brands', JSON.stringify(brands));
  }, [brands]);

  const [newBrand, setNewBrand] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', size: '', stock: '' });

  const handleAddBrand = () => {
    if (newBrand.trim() === '') return;
    const newEntry = {
      id: Date.now(),
      name: newBrand.trim(),
      items: [],
    };
    setBrands([...brands, newEntry]);
    setNewBrand('');
  };

  const handleDeleteBrand = (id) => {
    setBrands(brands.filter((b) => b.id !== id));
  };

  const handleEditBrand = (id, name) => {
    setEditId(id);
    setEditName(name);
  };

  const handleSaveEdit = () => {
    setBrands(brands.map((b) => (b.id === editId ? { ...b, name: editName } : b)));
    setEditId(null);
    setEditName('');
  };

  const toggleBrandItems = (id) => {
    setSelectedBrandId((prev) => (prev === id ? null : id));
  };

  const handleAddItem = (brandId) => {
    if (!newItem.name || !newItem.size || !newItem.stock) return;
    setBrands((prev) =>
      prev.map((b) =>
        b.id === brandId
          ? {
              ...b,
              items: [...b.items, { id: Date.now(), ...newItem }],
            }
          : b
      )
    );
    setNewItem({ name: '', size: '', stock: '' });
  };

  const handleItemChange = (brandId, itemId, field, value) => {
    setBrands((prev) =>
      prev.map((b) =>
        b.id === brandId
          ? {
              ...b,
              items: b.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
              ),
            }
          : b
      )
    );
  };

  const handleDeleteItem = (brandId, itemId) => {
    setBrands((prev) =>
      prev.map((b) =>
        b.id === brandId
          ? { ...b, items: b.items.filter((item) => item.id !== itemId) }
          : b
      )
    );
  };

  return (
    <div className="min-h-screen bg-nude p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kelola Brand & Pakaian</h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-md mb-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Tambah Brand Baru</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            className="flex-1 p-2 border rounded-md"
            placeholder="Nama Brand"
          />
          <button
            onClick={handleAddBrand}
            className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md"
          >
            Tambah
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {brands.map((brand) => (
          <div key={brand.id} className="bg-white p-4 rounded-md shadow-md">
            <div className="flex justify-between items-center mb-3">
              {editId === brand.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="p-2 border rounded-md"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
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
                  <span className="text-lg font-medium text-gray-800">{brand.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditBrand(brand.id, brand.name)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={() => toggleBrandItems(brand.id)}
                      className="bg-orange-300 hover:bg-orange-400 text-white px-3 py-1 rounded-md text-sm"
                    >
                      {selectedBrandId === brand.id ? 'Tutup' : 'Kelola Pakaian'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {selectedBrandId === brand.id && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-gray-700">Daftar Pakaian</h3>
                {brand.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(brand.id, item.id, 'name', e.target.value)}
                      className="flex-1 border px-2 py-1 rounded"
                    />
                    <input
                      type="text"
                      value={item.size}
                      onChange={(e) => handleItemChange(brand.id, item.id, 'size', e.target.value)}
                      className="w-20 border px-2 py-1 rounded"
                    />
                    <input
                      type="number"
                      value={item.stock}
                      onChange={(e) => handleItemChange(brand.id, item.id, 'stock', e.target.value)}
                      className="w-20 border px-2 py-1 rounded"
                    />
                    <button
                      onClick={() => handleDeleteItem(brand.id, item.id)}
                      className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    placeholder="Nama Pakaian"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="flex-1 border px-2 py-1 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Ukuran"
                    value={newItem.size}
                    onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
                    className="w-20 border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Stok"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                    className="w-20 border px-2 py-1 rounded"
                  />
                  <button
                    onClick={() => handleAddItem(brand.id)}
                    className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}