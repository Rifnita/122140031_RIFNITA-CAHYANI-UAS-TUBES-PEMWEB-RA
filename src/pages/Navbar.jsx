import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-2" />
        <span className="text-orange-500 font-bold text-lg">Wearspace Outfitly</span>
      </div>
      <div className="space-x-6">
        <Link to="/favorites" className="text-gray-700 hover:text-orange-500 font-medium">Favorites</Link>
        <Link to="/account" className="text-gray-700 hover:text-orange-500 font-medium">Akun</Link>
      </div>
    </nav>
  );
}
