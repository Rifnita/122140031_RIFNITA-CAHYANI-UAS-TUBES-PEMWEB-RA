import React, { useState, useEffect } from "react";
import useUsers from "../hooks/useUsers";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Pastikan sonner sudah terinstall dan terkonfigurasi

export default function Account() {
  const {
    user: authenticatedUser,
    loading: authLoading,
    error: authError,
  } = useAuth();
  const {
    loading: usersLoading,
    error: usersError,
    getUserById,
    updateUser,
  } = useUsers();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [account, setAccount] = useState({
    email: "",
    phone: "",
    address: "",
    password: "********",
  });

  // Effect untuk fetching data akun
  useEffect(() => {
    const fetchAccountData = async () => {
      if (authenticatedUser?.id) {
        try {
          const fetchedUser = await getUserById(authenticatedUser.id);
          if (fetchedUser) {
            setAccount({
              email: fetchedUser.email,
              phone: fetchedUser.phone || "",
              address: fetchedUser.address || "",
              password: "********", // Jangan pernah menampilkan password asli
            });
          }
        } catch (err) {
          console.error("Gagal mengambil data pengguna:", err);
          // Tampilkan toast error saja, jangan memblokir UI
          toast.error(
            "Gagal memuat data akun: " + (err.message || "Terjadi kesalahan.")
          );
        }
      }
    };

    if (!authLoading) {
      if (!authenticatedUser) {
        navigate("/"); // Redirect jika tidak ada user terautentikasi
      } else {
        fetchAccountData();
      }
    }
  }, [authenticatedUser, getUserById, authLoading, navigate]);

  // Effect untuk menampilkan error dari hook auth/users jika ada
  useEffect(() => {
    if (authError) {
      toast.error(
        "Autentikasi gagal: " + (authError.message || "Silakan login kembali.")
      );
    }
    if (usersError) {
      toast.error(
        "Kesalahan data pengguna: " +
          (usersError.message || "Terjadi kesalahan.")
      );
    }
  }, [authError, usersError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const dataToUpdate = {
        email: account.email,
        phone: account.phone,
        address: account.address,
      };
      // Hanya kirim password jika pengguna mengubahnya dari nilai default
      if (account.password !== "********") {
        dataToUpdate.password = account.password;
      }
      await updateUser(authenticatedUser.id, dataToUpdate);
      setEditMode(false);
      toast.success("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("Gagal memperbarui profil:", err);
      // Tampilkan toast error spesifik
      toast.error(
        "Gagal memperbarui profil: " + (err.message || "Terjadi kesalahan.")
      );
    }
  };

  // Render group for loading state
  if (authLoading || usersLoading) {
    return (
      <div className="p-8 text-center text-gray-700">Memuat data akun...</div>
    );
  }

  // Jika tidak ada authenticatedUser setelah loading selesai, berarti user tidak login
  // useEffect sudah menghandle redirect, jadi di sini cukup return null atau loading state
  if (!authenticatedUser) return null; // Atau tampilkan pesan "Anda tidak login" jika navigasi gagal

  return (
    <div className="bg-nude flex flex-col items-center min-h-screen p-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-800">Akun Saya</h1>
      <p className="mb-6 text-gray-600">
        Informasi akun pengguna yang dapat diperbarui sewaktu-waktu.
      </p>

      {/* Account Info Card */}
      <div className="rounded-xl md:flex-row flex flex-col items-start w-full max-w-3xl gap-6 p-6 bg-white shadow-md">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            account.email || "User"
          )}&background=FFA500&color=fff&rounded=true`}
          alt="Foto Profil"
          className="object-cover w-32 h-32 rounded-full"
        />

        <div className="flex-1">
          <div className="mb-3">
            <p className="text-sm text-gray-500">Email</p>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={account.email}
                onChange={handleChange}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 w-full px-3 py-2 border rounded"
              />
            ) : (
              <p className="text-lg font-medium text-gray-800">
                {account.email}
              </p>
            )}
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-500">Password</p>
            {editMode ? (
              <input
                type="password"
                name="password"
                value={account.password}
                onChange={handleChange}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 w-full px-3 py-2 border rounded"
                placeholder="********"
              />
            ) : (
              // Selalu tampilkan placeholder untuk keamanan
              <p className="text-lg font-medium text-gray-800">********</p>
            )}
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-500">Telepon</p>
            {editMode ? (
              <input
                type="text"
                name="phone"
                value={account.phone}
                onChange={handleChange}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 w-full px-3 py-2 border rounded"
              />
            ) : (
              <p className="text-lg font-medium text-gray-800">
                {account.phone || "Tidak diatur"}
              </p>
            )}
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-500">Alamat</p>
            {editMode ? (
              <textarea
                name="address"
                value={account.address}
                onChange={handleChange}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 w-full px-3 py-2 border rounded"
              />
            ) : (
              <p className="text-lg font-medium text-gray-800">
                {account.address || "Tidak diatur"}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="self-end">
          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="hover:bg-green-600 px-4 py-2 text-white transition duration-200 ease-in-out bg-green-500 rounded-md"
              >
                Simpan
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="hover:bg-gray-400 px-4 py-2 text-gray-800 transition duration-200 ease-in-out bg-gray-300 rounded-md"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="hover:bg-orange-500 px-4 py-2 text-white transition duration-200 ease-in-out bg-orange-400 rounded-md"
            >
              Edit Profil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
