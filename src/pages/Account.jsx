import React, { useState } from 'react';

export default function Account() {
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState('rifnita@example.com');
  const [password, setPassword] = useState('********');
  const [phone, setPhone] = useState('+62 812-3456-7890');
  const [address, setAddress] = useState('Jl. Melati No. 45, Bandar Lampung');

  const handleSave = () => {
    setEditMode(false);
    alert('Profil berhasil diperbarui!');
  };

  return (
    <div className="min-h-screen bg-nude p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Akun Saya</h1>
      <p className="text-gray-600 mb-6">
        Informasi akun pengguna yang dapat diperbarui sewaktu-waktu.
      </p>

      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl flex flex-col md:flex-row items-start gap-6">
        {/* Foto profil */}
        <img
          src="https://ui-avatars.com/api/?name=Rifnita&background=FFA500&color=fff&rounded=true"
          alt="Foto Profil"
          className="w-32 h-32 rounded-full object-cover"
        />

        {/* Info pengguna */}
        <div className="flex-1">
          <div className="mb-3">
            <p className="text-sm text-gray-500">Email</p>
            {editMode ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="text-lg font-medium text-gray-800">{email}</p>
            )}
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-500">Password</p>
            {editMode ? (
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="text-lg font-medium text-gray-800">{password}</p>
            )}
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-500">Telepon</p>
            {editMode ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="text-lg font-medium text-gray-800">{phone}</p>
            )}
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-500">Alamat</p>
            {editMode ? (
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="text-lg font-medium text-gray-800">{address}</p>
            )}
          </div>
        </div>

        {/* Tombol */}
        <div className="self-end">
          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Simpan
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md"
            >
              Edit Profil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
