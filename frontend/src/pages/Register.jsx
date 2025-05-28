import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(
        formData.email,
        formData.password,
        formData.phone,
        formData.address
      );
      toast.success("Pendaftaran berhasil! Silakan login.");
      navigate("/");
    } catch (err) {
      console.error("Pendaftaran gagal:", err.message);
      toast.error("Pendaftaran gagal: " + err.message);
    }
  };

  return (
    <div className="bg-nude flex items-center justify-center h-screen">
      <div className="rounded-xl w-full max-w-md p-10 text-center bg-white shadow-lg">
        <div className="mb-3 text-4xl">🚀</div>
        <h2 className="mb-6 text-3xl font-bold text-gray-800">
          Daftar Akun Baru
        </h2>

        <form className="space-y-5 text-left" onSubmit={handleRegister}>
          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="focus:outline-none focus:ring-2 focus:ring-orange-300 w-full px-4 py-2 border rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Kata Sandi
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="focus:outline-none focus:ring-2 focus:ring-orange-300 w-full px-4 py-2 border rounded-md"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Telepon (Opsional)
            </label>
            <input
              type="text"
              name="phone"
              placeholder="08123..."
              className="focus:outline-none focus:ring-2 focus:ring-orange-300 w-full px-4 py-2 border rounded-md"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Alamat (Opsional)
            </label>
            <textarea
              name="address"
              placeholder="Jl. Contoh No. 123"
              rows="3"
              className="focus:outline-none focus:ring-2 focus:ring-orange-300 w-full px-4 py-2 border rounded-md"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            type="submit"
            className="hover:bg-orange-600 w-full py-2 font-semibold text-white transition duration-300 bg-orange-500 rounded-md"
            disabled={loading}
          >
            {loading ? "Sedang mendaftar..." : "Daftar"}
          </button>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </form>

        <p className="mt-4 text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link
            to="/"
            className="hover:underline text-orange-500 cursor-pointer"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
