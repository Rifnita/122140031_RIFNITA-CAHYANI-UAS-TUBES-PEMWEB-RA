import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function Login() {
  const { login, loading: authLoading, error: authError, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginProcessing, setLoginProcessing] = useState(false); // State loading lokal

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginProcessing(true); // Mulai loading lokal
    const loadingToastId = toast.loading("Sedang memproses login..."); // Tampilkan loading toast

    try {
      const success = await login(email, password);

      if (success) {
        toast.success("Login berhasil!", { id: loadingToastId });

        setTimeout(() => {
          window.location.replace("/dashboard");
        }, 1000);
      } else {
        toast.error(authError || "Login gagal.", { id: loadingToastId });
      }

      setLoginProcessing(false);
    } catch (err) {
      console.error("Login gagal:", err.message);
      toast.error("Login gagal: " + err.message, { id: loadingToastId });
      setLoginProcessing(false); // Selesai loading lokal
    }
  };

  return (
    <div className="bg-nude flex items-center justify-center h-screen">
      <div className="rounded-xl w-full max-w-md p-10 text-center bg-white shadow-lg">
        <div className="mb-3 text-4xl">🛍️</div>
        <h2 className="mb-6 text-3xl font-bold text-gray-800">
          Selamat Datang <span className="inline-block">👋</span>
        </h2>

        <form className="space-y-5 text-left" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="focus:outline-none focus:ring-2 focus:ring-orange-300 w-full px-4 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Kata Sandi
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="focus:outline-none focus:ring-2 focus:ring-orange-300 w-full px-4 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="hover:bg-orange-600 w-full py-2 font-semibold text-white transition duration-300 bg-orange-500 rounded-md"
            disabled={authLoading || loginProcessing} // Nonaktifkan jika authLoading atau loginProcessing
          >
            {authLoading || loginProcessing ? "Sedang memproses..." : "Login"}
          </button>
          {authError && (
            <p className="mt-2 text-sm text-red-500">{authError}</p>
          )}
        </form>

        <p className="mt-2 text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="hover:underline text-orange-500 cursor-pointer"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
