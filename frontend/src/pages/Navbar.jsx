import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-2" />
        <span className="text-lg font-bold text-orange-500">
          Wearspace Outfitly
        </span>
      </div>
      <div className="space-x-6">
        <Link
          to="/favorites"
          className="hover:text-orange-500 font-medium text-gray-700"
        >
          Favorites
        </Link>
        <Link
          to="/account"
          className="hover:text-orange-500 font-medium text-gray-700"
        >
          Akun
        </Link>
        <Link
          to="/transactions"
          className="hover:text-orange-500 font-medium text-gray-700"
        >
          Transaksi
        </Link>
      </div>
    </nav>
  );
}
