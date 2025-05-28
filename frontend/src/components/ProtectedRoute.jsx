import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Sesuaikan path jika perlu

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // Tampilkan pesan loading saat autentikasi masih diproses
    return <div className="p-8 text-center">Memverifikasi sesi...</div>;
  }

  if (!user) {
    // Jika tidak ada user setelah loading selesai, arahkan ke halaman login
    return <Navigate to="/" replace />;
  }

  // Jika user ada, render children (komponen halaman yang dilindungi)
  return children;
}
