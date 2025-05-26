// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';

// Import halaman
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Brands from './pages/Brands';
import Inspirations from './pages/Inspirations';
import Favorites from './pages/Favorites';
import Account from './pages/Account';
import Checkout from './pages/Checkout';          // ✅ Checkout Page
import DetailProduct from './pages/DetailProduct'; // ✅ Detail Product Page
import Transactions from './pages/Transactions';
import Katalog from './pages/Katalog';
import TransactionDetails from './pages/TransactionDetails';
import Invoice from './pages/Invoice';
import Success from './pages/Success';
import Payment from './pages/Payment';

// ✅ Navbar didefinisikan langsung di sini
function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-orange-500 font-bold text-lg">🛍️ Wearspace Outfitly</span>
      </div>
      <div className="space-x-6">
        <Link to="/favorites" className="text-gray-700 hover:text-orange-500 font-medium">Favorites</Link>
        <Link to="/transactions" className="text-gray-700 hover:text-orange-500 font-medium">Transaksi</Link>
        <Link to="/account" className="text-gray-700 hover:text-orange-500 font-medium">Akun</Link>
      </div>
    </nav>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      {/* Tampilkan Navbar kecuali saat di halaman Login */}
      {location.pathname !== '/' && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/inspirations" element={<Inspirations />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/account" element={<Account />} />
        <Route path="/checkout" element={<Checkout />} />               {/* ✅ untuk halaman checkout */}
        <Route path="/product/:id" element={<DetailProduct />} />       {/* ✅ untuk detail produk */}
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transaction/:id" element={<TransactionDetails />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/success" element={<Success />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </>
  );
}