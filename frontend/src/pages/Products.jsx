import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useProducts from "../hooks/useProducts";
import useBrands from "../hooks/useBrands";
import useFavorites from "../hooks/useFavorites";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Products() {
  const { user, loading: authLoading, error: authError, isAdmin } = useAuth();
  const {
    loading: productsLoading,
    error: productsError,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const { loading: brandsLoading, error: brandsError, getBrands } = useBrands();
  const {
    loading: favoritesLoading,
    error: favoritesError,
    getFavorites,
    addFavorite,
    removeFavorite,
  } = useFavorites();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [editProductId, setEditProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand_id: "",
    price: "",
    stock: "",
    sizes: [],
    colors: [],
    image_url: "",
    description: "",
    material: "",
    category: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts || []);
      } catch (err) {
        console.error("Gagal mengambil produk:", err);
        toast.error("Gagal memuat produk: " + err.message);
      }
      try {
        const fetchedBrands = await getBrands();
        setBrands(fetchedBrands || []);
      } catch (err) {
        console.error("Gagal mengambil merek:", err);
        toast.error("Gagal memuat merek: " + err.message);
      }
      if (user) {
        try {
          const fetchedFavorites = await getFavorites();
          setFavorites(
            fetchedFavorites ? fetchedFavorites.map((fav) => fav.id) : []
          );
        } catch (err) {
          console.error("Gagal mengambil favorit:", err);
          toast.error("Gagal memuat favorit: " + err.message);
        }
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchData();
      }
    }
  }, [getProducts, getBrands, getFavorites, user, authLoading, navigate]);

  const toggleFavorite = async (productId) => {
    if (!user) {
      toast.error("Silakan login untuk memperbarui favorit.");
      return;
    }
    try {
      if (favorites.includes(productId)) {
        await removeFavorite(productId);
        setFavorites((prev) => prev.filter((id) => id !== productId));
        toast.success("Produk dihapus dari favorit!");
      } else {
        await addFavorite(productId);
        setFavorites((prev) => [...prev, productId]);
        toast.success("Produk ditambahkan ke favorit!");
      }
    } catch (err) {
      toast.error(`Gagal memperbarui favorit: ${err.message}`);
    }
  };

  const handleEditClick = (product) => {
    if (!isAdmin) {
      toast.error("Anda tidak memiliki izin untuk mengedit produk.");
      return;
    }
    setEditProductId(product.id);
    setEditProductData({
      ...product,
      sizes: product.sizes ? product.sizes.join(", ") : "",
      colors: product.colors ? product.colors.join(", ") : "",
    });
  };

  const handleChange = (e, isNew = false) => {
    const { name, value } = e.target;
    if (isNew) {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    } else {
      setEditProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEdit = async () => {
    if (!isAdmin) {
      toast.error("Anda tidak memiliki izin untuk menyimpan perubahan produk.");
      return;
    }
    try {
      const dataToSave = {
        ...editProductData,
        price: parseFloat(editProductData.price),
        stock: parseInt(editProductData.stock),
        sizes: editProductData.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        colors: editProductData.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      };
      await updateProduct(editProductId, dataToSave);
      await getProducts().then(setProducts);
      setEditProductId(null);
      toast.success("Produk berhasil diperbarui!");
    } catch (err) {
      toast.error(`Gagal memperbarui produk: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast.error("Anda tidak memiliki izin untuk menghapus produk.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await deleteProduct(id);
        await getProducts().then(setProducts);
        toast.success("Produk berhasil dihapus!");
      } catch (err) {
        toast.error(`Gagal menghapus produk: ${err.message}`);
      }
    }
  };

  const handleAddProduct = async () => {
    if (!isAdmin) {
      toast.error("Anda tidak memiliki izin untuk menambahkan produk.");
      return;
    }
    try {
      const dataToCreate = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        sizes: newProduct.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        colors: newProduct.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      };

      if (
        !dataToCreate.name ||
        !dataToCreate.brand_id ||
        isNaN(dataToCreate.price) ||
        isNaN(dataToCreate.stock)
      ) {
        toast.warning(
          "Harap isi semua bidang yang diperlukan (Nama, Merek, Harga, Stok)."
        );
        return;
      }

      await createProduct(dataToCreate);
      await getProducts().then(setProducts);
      setNewProduct({
        name: "",
        brand_id: "",
        price: "",
        stock: "",
        sizes: [],
        colors: [],
        image_url: "",
        description: "",
        material: "",
        category: "",
      });
      setShowAddForm(false);
      toast.success("Produk berhasil ditambahkan!");
    } catch (err) {
      toast.error(`Gagal menambahkan produk: ${err.message}`);
    }
  };

  if (authLoading || productsLoading || brandsLoading || favoritesLoading)
    return <div className="p-8 text-center">Memuat data...</div>;
  if (authError || productsError || brandsError || favoritesError)
    return (
      <div className="p-8 text-center text-red-600">
        Error memuat produk:{" "}
        {authError || productsError || brandsError || favoritesError}
      </div>
    );
  if (!user) return null;

  return (
    <div className="bg-nude min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Produk</h1>
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="hover:bg-orange-500 px-4 py-2 text-white transition bg-orange-400 rounded-md shadow-md"
          >
            {showAddForm ? "Tutup Form" : "+ Tambah Produk"}
          </button>
        )}
      </div>

      {isAdmin && showAddForm && (
        <div className="rounded-xl p-4 mb-6 bg-white shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Form Tambah Produk</h2>
          <div className="md:grid-cols-2 grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={(e) => handleChange(e, true)}
              placeholder="Nama Produk"
              className="p-2 border rounded-md"
            />
            <select
              name="brand_id"
              value={newProduct.brand_id}
              onChange={(e) => handleChange(e, true)}
              className="p-2 border rounded-md"
            >
              <option value="">Pilih Merek</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={(e) => handleChange(e, true)}
              placeholder="Harga"
              className="p-2 border rounded-md"
            />
            <input
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={(e) => handleChange(e, true)}
              placeholder="Stok"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="sizes"
              value={newProduct.sizes}
              onChange={(e) => handleChange(e, true)}
              placeholder="Ukuran (contoh: S, M, L)"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="colors"
              value={newProduct.colors}
              onChange={(e) => handleChange(e, true)}
              placeholder="Warna (contoh: Merah, Biru)"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="image_url"
              value={newProduct.image_url}
              onChange={(e) => handleChange(e, true)}
              placeholder="URL Gambar"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="description"
              value={newProduct.description}
              onChange={(e) => handleChange(e, true)}
              placeholder="Deskripsi"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="material"
              value={newProduct.material}
              onChange={(e) => handleChange(e, true)}
              placeholder="Bahan"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="category"
              value={newProduct.category}
              onChange={(e) => handleChange(e, true)}
              placeholder="Kategori"
              className="p-2 border rounded-md"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="hover:bg-green-600 px-4 py-2 mt-4 text-white bg-green-500 rounded-md"
          >
            Simpan Produk
          </button>
        </div>
      )}

      <div className="sm:grid-cols-2 md:grid-cols-3 grid grid-cols-1 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl hover:shadow-lg relative p-4 transition bg-white shadow-md"
          >
            <div className="right-3 top-3 absolute text-lg text-red-500 cursor-pointer">
              {favorites.includes(product.id) ? (
                <FaHeart onClick={() => toggleFavorite(product.id)} />
              ) : (
                <FaRegHeart onClick={() => toggleFavorite(product.id)} />
              )}
            </div>

            {/* Perbaikan di sini untuk gambar */}
            <div className="flex items-center justify-center w-full h-48 mb-3 bg-gray-100 rounded-md">
              <img
                src={product.image_url}
                alt={product.name}
                className="object-contain w-full h-full"
              />
            </div>

            {editProductId === product.id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editProductData.name}
                  onChange={handleChange}
                  placeholder="Nama Produk"
                  className="w-full p-1 mb-1 border rounded"
                />
                <select
                  name="brand_id"
                  value={editProductData.brand_id}
                  onChange={handleChange}
                  className="w-full p-1 mb-1 border rounded"
                >
                  <option value="">Pilih Merek</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="price"
                  value={editProductData.price}
                  onChange={handleChange}
                  placeholder="Harga"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="number"
                  name="stock"
                  value={editProductData.stock}
                  onChange={handleChange}
                  placeholder="Stok"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="text"
                  name="sizes"
                  value={editProductData.sizes}
                  onChange={handleChange}
                  placeholder="Ukuran (contoh: S, M, L)"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="text"
                  name="colors"
                  value={editProductData.colors}
                  onChange={handleChange}
                  placeholder="Warna (contoh: Merah, Biru)"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="text"
                  name="image_url"
                  value={editProductData.image_url}
                  onChange={handleChange}
                  placeholder="URL Gambar"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="text"
                  name="description"
                  value={editProductData.description}
                  onChange={handleChange}
                  placeholder="Deskripsi"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="text"
                  name="material"
                  value={editProductData.material}
                  onChange={handleChange}
                  placeholder="Bahan"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="text"
                  name="category"
                  value={editProductData.category}
                  onChange={handleChange}
                  placeholder="Kategori"
                  className="w-full p-1 mb-1 border rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="hover:bg-green-600 px-3 py-1 text-sm text-white bg-green-500 rounded-md"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditProductId(null)}
                    className="hover:bg-gray-500 px-3 py-1 text-sm text-white bg-gray-400 rounded-md"
                  >
                    Batal
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h2>
                <p className="mb-1 text-sm text-gray-500">
                  Merek:{" "}
                  {brands.find((b) => b.id === product.brand_id)?.name || "N/A"}
                </p>
                <p className="mb-2 font-semibold text-orange-500">
                  Rp {parseFloat(product.price).toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-gray-600">Stok: {product.stock}</p>
                <p className="text-sm text-gray-600">
                  Ukuran: {product.sizes?.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  Warna: {product.colors?.join(", ")}
                </p>
                {isAdmin && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="hover:bg-blue-600 px-3 py-1 text-sm text-white bg-blue-500 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="hover:bg-red-600 px-3 py-1 text-sm text-white bg-red-500 rounded-md"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
