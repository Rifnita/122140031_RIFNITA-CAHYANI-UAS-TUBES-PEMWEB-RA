import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

export default function Success() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return <div className="p-8 text-center">Memuat...</div>;
  }
  if (!user) {
    return null;
  }

  return (
    <div className="bg-nude flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <FaCheckCircle className="mb-4 text-6xl text-green-500" />
      <h1 className="mb-2 text-3xl font-bold text-gray-800">
        Transaksi Berhasil!
      </h1>
      <p className="mb-6 text-gray-600">
        Terima kasih telah berbelanja di Wearspace Outfitly.
      </p>
      <Link
        to="/transactions"
        className="hover:bg-orange-600 px-6 py-2 text-white bg-orange-500 rounded-md"
      >
        Lihat Riwayat Transaksi
      </Link>
    </div>
  );
}
