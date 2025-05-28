import React, { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { toast } from "sonner";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Brands from "./pages/Brands";
import Inspirations from "./pages/Inspirations";
import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import DetailProduct from "./pages/DetailProduct";
import Transactions from "./pages/Transactions";
import Katalog from "./pages/Katalog";
import TransactionDetails from "./pages/TransactionDetails";
import Invoice from "./pages/Invoice";
import Success from "./pages/Success";
import Payment from "./pages/Payment";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import ManageInspirations from "./pages/ManageInspirations";

function Navbar({ user, onLogout, isAdmin }) {
  // Tambahkan isAdmin ke prop Navbar
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleCloseMenu = () => setIsOpen(false);

  return (
    <nav className="px-6 py-3 bg-white shadow">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center text-lg font-bold text-orange-500">
          🛍️ Wearspace Outfitly
        </div>

        {/* Toggle Button (Mobile) */}
        <button
          onClick={handleToggle}
          className="md:hidden focus:outline-none text-2xl text-orange-500"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menu - Desktop */}
        <div className="md:flex items-center hidden space-x-6">
          <Link
            to="/dashboard"
            className="hover:text-orange-500 font-medium text-gray-700"
          >
            Dashboard
          </Link>
          <Link
            to="/katalog"
            className="hover:text-orange-500 font-medium text-gray-700"
          >
            Katalog
          </Link>
          <Link
            to="/inspirations"
            className="hover:text-orange-500 font-medium text-gray-700"
          >
            Inspirasi
          </Link>
          <Link
            to="/favorites"
            className="hover:text-orange-500 font-medium text-gray-700"
          >
            Favorites
          </Link>
          <Link
            to="/transactions"
            className="hover:text-orange-500 font-medium text-gray-700"
          >
            Transaksi
          </Link>
          <Link
            to="/account"
            className="hover:text-orange-500 font-medium text-gray-700"
          >
            Akun
          </Link>
          {isAdmin && ( // Hanya tampilkan link ini jika user adalah admin
            <Link
              to="/manage-inspirations"
              className="hover:text-orange-500 font-medium text-gray-700"
            >
              Kelola Inspirasi
            </Link>
          )}
          {user ? (
            <button
              onClick={onLogout}
              className="hover:text-orange-500 font-medium text-gray-700"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/"
              className="hover:text-orange-500 font-medium text-gray-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Menu - Mobile */}
      {isOpen && (
        <div className="md:hidden flex flex-col mt-4 space-y-3">
          <Link
            to="/dashboard"
            onClick={handleCloseMenu}
            className="hover:text-orange-500 font-medium text-gray-700"
          >
            Dashboard
          </Link>
          <Link
            to="/katalog"
            onClick={handleCloseMenu}
            className="hover:text-orange-500 font-medium text-gray-700"
          >
            Katalog
          </Link>
          <Link
            to="/inspirations"
            onClick={handleCloseMenu}
            className="hover:text-orange-500 font-medium text-gray-700"
          >
            Inspirasi
          </Link>
          <Link
            to="/favorites"
            onClick={handleCloseMenu}
            className="hover:text-orange-500 font-medium text-gray-700"
          >
            Favorites
          </Link>
          <Link
            to="/transactions"
            onClick={handleCloseMenu}
            className="hover:text-orange-500 font-medium text-gray-700"
          >
            Transaksi
          </Link>
          <Link
            to="/account"
            onClick={handleCloseMenu}
            className="hover:text-orange-500 font-medium text-gray-700"
          >
            Akun
          </Link>
          {isAdmin && ( // Hanya tampilkan link ini jika user adalah admin
            <Link
              to="/manage-inspirations"
              onClick={handleCloseMenu}
              className="hover:text-orange-500 font-medium text-gray-700"
            >
              Kelola Inspirasi
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                onLogout();
                handleCloseMenu();
              }}
              className="hover:text-orange-500 font-medium text-left text-gray-700"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/"
              onClick={handleCloseMenu}
              className="hover:text-orange-500 font-medium text-gray-700"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading, isAdmin } = useAuth(); // Ambil isAdmin

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("Logout berhasil!");
    } catch (e) {
      toast.error("Gagal logout: " + e.message);
    }
  };

  useEffect(() => {
    const publicRoutes = ["/", "/register"];
    // Perbaikan: Pastikan user null secara eksplisit
    if (
      !loading &&
      user === null &&
      !publicRoutes.includes(location.pathname)
    ) {
      navigate("/");
    }
  }, [user, location.pathname, navigate, loading]);

  if (loading) {
    return <div className="p-8 text-center">Memuat aplikasi...</div>;
  }

  return (
    <>
      {location.pathname !== "/" && location.pathname !== "/register" && (
        <Navbar user={user} onLogout={handleLogout} isAdmin={isAdmin} />
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected routes */}
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/katalog" element={<Katalog />} />{" "}
            {/* Pastikan Katalog tersedia untuk user */}
            <Route path="/inspirations" element={<Inspirations />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<DetailProduct />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transaction/:id" element={<TransactionDetails />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/success" element={<Success />} />
            <Route path="/payment" element={<Payment />} />
            {/* Admin-only routes */}
            {isAdmin && (
              <>
                <Route path="/products" element={<Products />} />
                <Route path="/brands" element={<Brands />} />
                <Route
                  path="/manage-inspirations"
                  element={<ManageInspirations />}
                />{" "}
                {/* New Admin route */}
              </>
            )}
            {/* Fallback for authenticated users */}
            <Route path="*" element={<Dashboard />} />
          </>
        ) : (
          /* Fallback for unauthenticated users */
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    </>
  );
}
