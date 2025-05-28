import React, { useState, useEffect } from "react";
import useInspirations from "../hooks/useInspirations";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ManageInspirations() {
  const { user, loading: authLoading, error: authError, isAdmin } = useAuth();
  const {
    loading: inspirationsLoading,
    error: inspirationsError,
    getInspirations,
    createInspiration,
    updateInspiration,
    deleteInspiration,
  } = useInspirations();
  const navigate = useNavigate();

  const [inspirations, setInspirations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editInspirationId, setEditInspirationId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    tag: "",
  });

  useEffect(() => {
    const fetchInspirationsData = async () => {
      try {
        const fetchedInspirations = await getInspirations();
        setInspirations(fetchedInspirations || []);
      } catch (err) {
        console.error("Gagal mengambil inspirasi:", err);
        toast.error(
          "Gagal memuat inspirasi: " + (err.message || "Terjadi kesalahan.")
        );
      }
    };

    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else if (!isAdmin) {
        toast.error("Anda tidak memiliki izin untuk mengelola inspirasi.");
        navigate("/dashboard");
      } else {
        fetchInspirationsData();
      }
    }
  }, [getInspirations, user, authLoading, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      tag: "",
    });
    setEditInspirationId(null);
    setShowAddForm(false);
  };

  const handleAddInspiration = async () => {
    if (!isAdmin) {
      toast.error("Anda tidak memiliki izin untuk menambahkan inspirasi.");
      return;
    }
    try {
      if (
        !formData.title ||
        !formData.description ||
        !formData.image_url ||
        !formData.tag
      ) {
        toast.warning("Harap isi semua bidang yang diperlukan.");
        return;
      }
      await createInspiration(formData);
      await getInspirations().then(setInspirations);
      toast.success("Inspirasi berhasil ditambahkan!");
      resetForm();
    } catch (err) {
      console.error("Gagal menambahkan inspirasi:", err);
      toast.error(
        "Gagal menambahkan inspirasi: " + (err.message || "Terjadi kesalahan.")
      );
    }
  };

  const handleEditClick = (inspiration) => {
    if (!isAdmin) {
      toast.error("Anda tidak memiliki izin untuk mengedit inspirasi.");
      return;
    }
    setEditInspirationId(inspiration.id);
    setFormData({
      title: inspiration.title,
      description: inspiration.description,
      image_url: inspiration.image_url,
      tag: inspiration.tag,
    });
    setShowAddForm(true);
  };

  const handleSaveEdit = async () => {
    if (!isAdmin) {
      toast.error(
        "Anda tidak memiliki izin untuk menyimpan perubahan inspirasi."
      );
      return;
    }
    try {
      if (
        !formData.title ||
        !formData.description ||
        !formData.image_url ||
        !formData.tag
      ) {
        toast.warning("Harap isi semua bidang yang diperlukan.");
        return;
      }
      await updateInspiration(editInspirationId, formData);
      await getInspirations().then(setInspirations);
      toast.success("Inspirasi berhasil diperbarui!");
      resetForm();
    } catch (err) {
      console.error("Gagal memperbarui inspirasi:", err);
      toast.error(
        "Gagal memperbarui inspirasi: " + (err.message || "Terjadi kesalahan.")
      );
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast.error("Anda tidak memiliki izin untuk menghapus inspirasi.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus inspirasi ini?")) {
      try {
        await deleteInspiration(id);
        setInspirations((prev) => prev.filter((inspo) => inspo.id !== id));
        toast.success("Inspirasi berhasil dihapus!");
      } catch (err) {
        console.error("Gagal menghapus inspirasi:", err);
        toast.error(
          "Gagal menghapus inspirasi: " + (err.message || "Terjadi kesalahan.")
        );
      }
    }
  };

  if (authLoading || inspirationsLoading) {
    return (
      <div className="p-8 text-center text-gray-700">
        <p className="animate-pulse">Memuat halaman manajemen inspirasi...</p>
      </div>
    );
  }

  if (authError || inspirationsError) {
    return (
      <div className="p-8 text-center text-red-600">
        Error:{" "}
        {authError?.message ||
          inspirationsError?.message ||
          "Terjadi kesalahan."}
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="bg-nude min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kelola Inspirasi</h1>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (editInspirationId) resetForm();
          }}
          className="hover:bg-orange-500 px-4 py-2 text-white transition bg-orange-400 rounded-md shadow-md"
        >
          {showAddForm ? "Tutup Form" : "+ Tambah Inspirasi"}
        </button>
      </div>

      {showAddForm && (
        <div className="rounded-xl p-4 mb-6 bg-white shadow-md">
          <h2 className="mb-4 text-xl font-semibold">
            {editInspirationId ? "Edit Inspirasi" : "Tambah Inspirasi Baru"}
          </h2>
          <div className="md:grid-cols-2 grid grid-cols-1 gap-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Judul Inspirasi"
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              placeholder="Tag (contoh: kampus, pesta, olahraga)"
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="URL Gambar Inspirasi"
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 border rounded-md"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi Inspirasi"
              rows="3"
              className="md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-1 p-2 border rounded-md"
              required
            ></textarea>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={
                editInspirationId ? handleSaveEdit : handleAddInspiration
              }
              className="hover:bg-green-600 px-4 py-2 text-white transition duration-200 ease-in-out bg-green-500 rounded-md"
            >
              {editInspirationId ? "Simpan Perubahan" : "Tambah Inspirasi"}
            </button>
            <button
              onClick={resetForm}
              className="hover:bg-gray-400 px-4 py-2 text-gray-800 transition duration-200 ease-in-out bg-gray-300 rounded-md"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Inspirations List */}
      <div className="sm:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-6">
        {inspirations.length === 0 && !inspirationsLoading ? (
          <div className="col-span-full text-center text-gray-500">
            Belum ada inspirasi yang ditambahkan.
          </div>
        ) : (
          inspirations.map((inspo) => (
            <div
              key={inspo.id}
              className="rounded-xl hover:shadow-lg overflow-hidden transition-shadow duration-300 bg-white shadow-md"
            >
              {/* Ini adalah bagian yang diubah untuk menampilkan gambar sepenuhnya */}
              <div className="relative flex items-center justify-center w-full h-56 bg-gray-100">
                <img
                  src={inspo.image_url}
                  alt={inspo.title}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  {inspo.title}
                </h2>
                <p className="line-clamp-2 text-sm text-gray-600">
                  {inspo.description}
                </p>
                <p className="mt-2 text-xs text-gray-500">Tags: {inspo.tag}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditClick(inspo)}
                    className="hover:bg-blue-600 px-3 py-1 text-sm text-white transition duration-200 ease-in-out bg-blue-500 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(inspo.id)}
                    className="hover:bg-red-600 px-3 py-1 text-sm text-white transition duration-200 ease-in-out bg-red-500 rounded-md"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
