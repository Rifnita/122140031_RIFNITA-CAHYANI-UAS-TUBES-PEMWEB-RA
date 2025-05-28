import React, { useState, useEffect } from "react";
import useBrands from "../hooks/useBrands";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Brands() {
  const { user, loading: authLoading, error: authError, isAdmin } = useAuth();
  const {
    loading: brandsLoading,
    error: brandsError,
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand,
  } = useBrands();
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  const [newBrandName, setNewBrandName] = useState("");
  const [editBrandId, setEditBrandId] = useState(null);
  const [editBrandName, setEditBrandName] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const fetchedBrands = await getBrands();
        setBrands(fetchedBrands || []);
      } catch (err) {
        console.error("Gagal mengambil merek:", err);
        toast.error("Gagal memuat merek: " + err.message);
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchBrands();
      }
    }
  }, [getBrands, user, authLoading, navigate]);

  const handleAddBrand = async () => {
    if (!isAdmin) {
      // Hanya admin yang bisa menambah
      toast.error("Anda tidak memiliki izin untuk menambahkan merek.");
      return;
    }
    if (newBrandName.trim() === "") {
      toast.warning("Nama merek tidak boleh kosong.");
      return;
    }
    try {
      await createBrand(newBrandName.trim());
      await getBrands().then(setBrands);
      setNewBrandName("");
      toast.success("Merek berhasil ditambahkan!");
    } catch (err) {
      toast.error(`Gagal menambahkan merek: ${err.message}`);
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!isAdmin) {
      // Hanya admin yang bisa menghapus
      toast.error("Anda tidak memiliki izin untuk menghapus merek.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus merek ini?")) {
      try {
        await deleteBrand(id);
        await getBrands().then(setBrands);
        toast.success("Merek berhasil dihapus!");
      } catch (err) {
        toast.error(`Gagal menghapus merek: ${err.message}`);
      }
    }
  };

  const handleEditBrand = (id, name) => {
    if (!isAdmin) {
      // Hanya admin yang bisa mengedit
      toast.error("Anda tidak memiliki izin untuk mengedit merek.");
      return;
    }
    setEditBrandId(id);
    setEditBrandName(name);
  };

  const handleSaveEdit = async () => {
    if (!isAdmin) {
      // Hanya admin yang bisa menyimpan perubahan
      toast.error("Anda tidak memiliki izin untuk menyimpan perubahan merek.");
      return;
    }
    if (editBrandName.trim() === "") {
      toast.warning("Nama merek tidak boleh kosong.");
      return;
    }
    try {
      await updateBrand(editBrandId, editBrandName.trim());
      await getBrands().then(setBrands);
      setEditBrandId(null);
      setEditBrandName("");
      toast.success("Merek berhasil diperbarui!");
    } catch (err) {
      toast.error(`Gagal memperbarui merek: ${err.message}`);
    }
  };

  if (authLoading || brandsLoading)
    return <div className="p-8 text-center">Memuat merek...</div>;
  if (authError || brandsError)
    return (
      <div className="p-8 text-center text-red-600">
        Error: {authError || brandsError}
      </div>
    );
  if (!user) return null;

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Kelola Merek</h1>

      {isAdmin && ( // Hanya tampilkan form tambah jika admin
        <div className="rounded-xl max-w-md p-6 mb-8 bg-white shadow-md">
          <h2 className="mb-2 text-lg font-semibold text-gray-700">
            Tambah Merek Baru
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="flex-1 p-2 border rounded-md"
              placeholder="Nama Merek"
            />
            <button
              onClick={handleAddBrand}
              className="hover:bg-orange-500 px-4 py-2 text-white bg-orange-400 rounded-md"
            >
              Tambah
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {brands.map((brand) => (
          <div key={brand.id} className="p-4 bg-white rounded-md shadow-md">
            <div className="flex items-center justify-between mb-3">
              {editBrandId === brand.id ? (
                <>
                  <input
                    type="text"
                    value={editBrandName}
                    onChange={(e) => setEditBrandName(e.target.value)}
                    className="p-2 border rounded-md"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="hover:bg-green-600 px-3 py-1 text-sm text-white bg-green-500 rounded-md"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setEditBrandId(null)}
                      className="hover:bg-gray-500 px-3 py-1 text-sm text-white bg-gray-400 rounded-md"
                    >
                      Batal
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-lg font-medium text-gray-800">
                    {brand.name}
                  </span>
                  {isAdmin && ( // Hanya tampilkan tombol edit/hapus jika admin
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBrand(brand.id, brand.name)}
                        className="hover:bg-blue-600 px-3 py-1 text-sm text-white bg-blue-500 rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="hover:bg-red-600 px-3 py-1 text-sm text-white bg-red-500 rounded-md"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
