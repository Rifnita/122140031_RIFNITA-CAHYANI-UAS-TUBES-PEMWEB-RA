# Frontend Code Context from 'src'

This document contains the consolidated code from the 'src' directory.
It is intended for AI context or documentation purposes.

---

## File: `App.jsx`

```
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

function Navbar({ user, onLogout }) {
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
        <Navbar user={user} onLogout={handleLogout} />
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/brands" element={<Brands />} />
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
            <Route path="/katalog" element={<Katalog />} />
          </>
        ) : (
          <Route path="*" element={<Login />} />
        )}
        {user && <Route path="*" element={<Dashboard />} />}
      </Routes>
    </>
  );
}

```

## File: `index.css`

```
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #f4ede8;
}

.input {
  @apply focus:outline-none focus:ring focus:border-gray-300 block w-full px-4 py-2 border rounded-md;
}

.btn {
  @apply hover:bg-pink-400 py-2 text-white transition-all bg-pink-300 rounded-md;
}

::-webkit-scrollbar {
  width: 0px;
}

```

## File: `main.jsx`

```
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true }}>
      <App />
      <Toaster position="top-right" richColors />{" "}
    </BrowserRouter>
  </React.StrictMode>
);

```

## File: `components\ProtectedRoute.jsx`

```
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

```

## File: `hooks\useApi.js`

```
// src/hooks/useApi.js
import { useState, useCallback } from "react";

const BASE_URL = "http://localhost:6543";

function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const url = `${BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
        ...options,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, request };
}

export default useApi;

```

## File: `hooks\useAuth.js`

```
import { useState, useCallback, useEffect } from "react";
import useApi from "./useApi";
import Cookies from "js-cookie";

const AUTH_COOKIE_NAME = "wearspace_auth";
const USER_DATA_COOKIE_NAME = "wearspace_user";

const HARDCODED_ADMIN_EMAIL = "admin@wearspace.com";

function useAuth() {
  const { request, loading: apiLoading, error: apiError } = useApi();

  const checkSession = useCallback(() => {
    const userDataString = Cookies.get(USER_DATA_COOKIE_NAME);

    let parsedUser = null;
    if (userDataString) {
      try {
        parsedUser = JSON.parse(userDataString);
      } catch (e) {
        console.error("Gagal mengurai data pengguna dari cookie:", e);
        Cookies.remove(USER_DATA_COOKIE_NAME);
      }
    }

    // Validasi sesi hanya berdasarkan keberadaan parsedUser dan ID-nya
    const isValid = !!parsedUser && !!parsedUser.id;

    if (isValid) {
      const role =
        parsedUser.email === HARDCODED_ADMIN_EMAIL ? "admin" : "user";
      return { ...parsedUser, role };
    }
    return null;
  }, []);

  // Inisialisasi state user secara langsung menggunakan checkSession sinkron
  const [user, setUser] = useState(() => {
    return checkSession();
  });

  // Effect untuk memperbarui cookie USER_DATA_COOKIE_NAME jika user berubah
  // dan juga memastikan role terupdate
  useEffect(() => {
    if (user) {
      const role = user.email === HARDCODED_ADMIN_EMAIL ? "admin" : "user";
      // Hanya update jika role belum diset atau berbeda
      if (user.role !== role || !Cookies.get(USER_DATA_COOKIE_NAME)) {
        const userWithUpdatedRole = { ...user, role };
        setUser(userWithUpdatedRole); // Pastikan state user juga terupdate
        Cookies.set(
          USER_DATA_COOKIE_NAME,
          JSON.stringify(userWithUpdatedRole),
          { expires: 7 }
        );
      }
    } else {
      // Jika user null (logout), pastikan cookie data user dihapus
      Cookies.remove(USER_DATA_COOKIE_NAME);
    }
  }, [user]); // Dependensi pada objek user

  const register = useCallback(
    async (email, password, phone, address) => {
      try {
        const result = await request("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, phone, address }),
        });

        if (result.user) {
          const role =
            result.user.email === HARDCODED_ADMIN_EMAIL ? "admin" : "user";
          const userWithRole = { ...result.user, role };
          setUser(userWithRole);
          Cookies.set(USER_DATA_COOKIE_NAME, JSON.stringify(userWithRole), {
            expires: 7,
          });
        }
        return result;
      } catch (err) {
        console.error("Kesalahan pendaftaran:", err);
        throw err;
      }
    },
    [request]
  );

  const login = useCallback(
    async (email, password) => {
      try {
        const result = await request("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        if (result.user) {
          const role =
            result.user.email === HARDCODED_ADMIN_EMAIL ? "admin" : "user";
          const userWithRole = { ...result.user, role };
          setUser(userWithRole);
          Cookies.set(USER_DATA_COOKIE_NAME, JSON.stringify(userWithRole), {
            expires: 7,
          });
        }
        return result;
      } catch (err) {
        console.error("Kesalahan login:", err);
        throw err;
      }
    },
    [request]
  );

  const logout = useCallback(async () => {
    try {
      await request("/api/auth/logout", { method: "POST" });
      setUser(null);
      // Hapus kedua cookie saat logout
      Cookies.remove(AUTH_COOKIE_NAME); // Cookie HttpOnly (jika ada)
      Cookies.remove(USER_DATA_COOKIE_NAME); // Cookie data user frontend
    } catch (err) {
      console.error("Kesalahan logout:", err);
      throw err;
    }
  }, [request]);

  const overallLoading = apiLoading;
  const overallError = apiError;
  const isAdmin = user?.role === "admin";

  return {
    user,
    register,
    login,
    logout,
    checkSession,
    loading: overallLoading,
    error: overallError,
    isAdmin,
  };
}

export default useAuth;

```

## File: `hooks\useBrands.js`

```
// src/hooks/useBrands.js
import { useCallback } from "react";
import useApi from "./useApi";

function useBrands() {
  const { data, loading, error, request } = useApi();

  const getBrands = useCallback(async () => {
    return request("/api/brands");
  }, [request]);

  const createBrand = useCallback(
    async (name) => {
      return request("/api/brands", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
    },
    [request]
  );

  const updateBrand = useCallback(
    async (id, name) => {
      return request(`/api/brands/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
    },
    [request]
  );

  const deleteBrand = useCallback(
    async (id) => {
      return request(`/api/brands/${id}`, {
        method: "DELETE",
      });
    },
    [request]
  );

  return {
    data,
    loading,
    error,
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand,
  };
}

export default useBrands;

```

## File: `hooks\useFavorites.js`

```
// src/hooks/useFavorites.js
import { useCallback } from "react";
import useApi from "./useApi";

function useFavorites() {
  const { data, loading, error, request } = useApi();

  const getFavorites = useCallback(async () => {
    // This assumes the API correctly uses the authenticated_userid from the cookie
    return request("/api/favorites");
  }, [request]);

  const addFavorite = useCallback(
    async (productId) => {
      return request("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ product_id: productId }),
      });
    },
    [request]
  );

  const removeFavorite = useCallback(
    async (productId) => {
      return request(`/api/favorites/${productId}`, {
        method: "DELETE",
      });
    },
    [request]
  );

  return { data, loading, error, getFavorites, addFavorite, removeFavorite };
}

export default useFavorites;

```

## File: `hooks\useInspirations.js`

```
// src/hooks/useInspirations.js
import { useCallback } from "react";
import useApi from "./useApi";

function useInspirations() {
  const { data, loading, error, request } = useApi();

  const getInspirations = useCallback(
    async (tag = "") => {
      const url = tag
        ? `/api/inspirations?tag=${encodeURIComponent(tag)}`
        : "/api/inspirations";
      return request(url);
    },
    [request]
  );

  const getInspirationById = useCallback(
    async (id) => {
      return request(`/api/inspirations/${id}`);
    },
    [request]
  );

  const createInspiration = useCallback(
    async (inspirationData) => {
      return request("/api/inspirations", {
        method: "POST",
        body: JSON.stringify(inspirationData),
      });
    },
    [request]
  );

  const updateInspiration = useCallback(
    async (id, inspirationData) => {
      return request(`/api/inspirations/${id}`, {
        method: "PUT",
        body: JSON.stringify(inspirationData),
      });
    },
    [request]
  );

  const deleteInspiration = useCallback(
    async (id) => {
      return request(`/api/inspirations/${id}`, {
        method: "DELETE",
      });
    },
    [request]
  );

  return {
    data,
    loading,
    error,
    getInspirations,
    getInspirationById,
    createInspiration,
    updateInspiration,
    deleteInspiration,
  };
}

export default useInspirations;

```

## File: `hooks\useProducts.js`

```
// src/hooks/useProducts.js
import { useCallback } from "react";
import useApi from "./useApi";

function useProducts() {
  const { data, loading, error, request } = useApi();

  const getProducts = useCallback(async () => {
    return request("/api/products");
  }, [request]);

  const getProductById = useCallback(
    async (id) => {
      return request(`/api/products/${id}`);
    },
    [request]
  );

  const createProduct = useCallback(
    async (productData) => {
      return request("/api/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });
    },
    [request]
  );

  const updateProduct = useCallback(
    async (id, productData) => {
      return request(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      });
    },
    [request]
  );

  const deleteProduct = useCallback(
    async (id) => {
      return request(`/api/products/${id}`, {
        method: "DELETE",
      });
    },
    [request]
  );

  return {
    data,
    loading,
    error,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

export default useProducts;

```

## File: `hooks\useTransactions.js`

```
// src/hooks/useTransactions.js
import { useCallback } from "react";
import useApi from "./useApi";

function useTransactions() {
  const { data, loading, error, request } = useApi();

  const getTransactions = useCallback(async () => {
    return request("/api/transactions");
  }, [request]);

  const getTransactionById = useCallback(
    async (id) => {
      return request(`/api/transactions/${id}`);
    },
    [request]
  );

  const createTransaction = useCallback(
    async (transactionData) => {
      return request("/api/transactions", {
        method: "POST",
        body: JSON.stringify(transactionData),
      });
    },
    [request]
  );

  const updateTransactionStatus = useCallback(
    async (id, status) => {
      return request(`/api/transactions/${id}`, {
        method: "PUT",
        body: JSON.stringify({ transaction_status: status }),
      });
    },
    [request]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      return request(`/api/transactions/${id}`, {
        method: "DELETE",
      });
    },
    [request]
  );

  return {
    data,
    loading,
    error,
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransactionStatus,
    deleteTransaction,
  };
}

export default useTransactions;

```

## File: `hooks\useUsers.js`

```
// src/hooks/useUsers.js
import { useCallback } from "react";
import useApi from "./useApi";

function useUsers() {
  const { data, loading, error, request } = useApi();

  const getUsers = useCallback(async () => {
    return request("/api/users");
  }, [request]);

  const getUserById = useCallback(
    async (id) => {
      return request(`/api/users/${id}`);
    },
    [request]
  );

  const updateUser = useCallback(
    async (id, userData) => {
      return request(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
    },
    [request]
  );

  const deleteUser = useCallback(
    async (id) => {
      return request(`/api/users/${id}`, {
        method: "DELETE",
      });
    },
    [request]
  );

  return {
    data,
    loading,
    error,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
  };
}

export default useUsers;

```

## File: `pages\Account.jsx`

```
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

```

## File: `pages\Brands.jsx`

```
import React, { useState, useEffect } from "react";
import useBrands from "../hooks/useBrands";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Brands() {
  const { user, loading: authLoading, error: authError, isAdmin } = useAuth();
  const {
    loading: brandsLoading,
    error: brandsError,
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand,
  } = useBrands();
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  const [newBrandName, setNewBrandName] = useState("");
  const [editBrandId, setEditBrandId] = useState(null);
  const [editBrandName, setEditBrandName] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const fetchedBrands = await getBrands();
        setBrands(fetchedBrands || []);
      } catch (err) {
        console.error("Gagal mengambil merek:", err);
        toast.error("Gagal memuat merek: " + err.message);
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchBrands();
      }
    }
  }, [getBrands, user, authLoading, navigate]);

  const handleAddBrand = async () => {
    if (!isAdmin) {
      // Hanya admin yang bisa menambah
      toast.error("Anda tidak memiliki izin untuk menambahkan merek.");
      return;
    }
    if (newBrandName.trim() === "") {
      toast.warning("Nama merek tidak boleh kosong.");
      return;
    }
    try {
      await createBrand(newBrandName.trim());
      await getBrands().then(setBrands);
      setNewBrandName("");
      toast.success("Merek berhasil ditambahkan!");
    } catch (err) {
      toast.error(`Gagal menambahkan merek: ${err.message}`);
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!isAdmin) {
      // Hanya admin yang bisa menghapus
      toast.error("Anda tidak memiliki izin untuk menghapus merek.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus merek ini?")) {
      try {
        await deleteBrand(id);
        await getBrands().then(setBrands);
        toast.success("Merek berhasil dihapus!");
      } catch (err) {
        toast.error(`Gagal menghapus merek: ${err.message}`);
      }
    }
  };

  const handleEditBrand = (id, name) => {
    if (!isAdmin) {
      // Hanya admin yang bisa mengedit
      toast.error("Anda tidak memiliki izin untuk mengedit merek.");
      return;
    }
    setEditBrandId(id);
    setEditBrandName(name);
  };

  const handleSaveEdit = async () => {
    if (!isAdmin) {
      // Hanya admin yang bisa menyimpan perubahan
      toast.error("Anda tidak memiliki izin untuk menyimpan perubahan merek.");
      return;
    }
    if (editBrandName.trim() === "") {
      toast.warning("Nama merek tidak boleh kosong.");
      return;
    }
    try {
      await updateBrand(editBrandId, editBrandName.trim());
      await getBrands().then(setBrands);
      setEditBrandId(null);
      setEditBrandName("");
      toast.success("Merek berhasil diperbarui!");
    } catch (err) {
      toast.error(`Gagal memperbarui merek: ${err.message}`);
    }
  };

  if (authLoading || brandsLoading)
    return <div className="p-8 text-center">Memuat merek...</div>;
  if (authError || brandsError)
    return (
      <div className="p-8 text-center text-red-600">
        Error: {authError || brandsError}
      </div>
    );
  if (!user) return null;

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Kelola Merek</h1>

      {isAdmin && ( // Hanya tampilkan form tambah jika admin
        <div className="rounded-xl max-w-md p-6 mb-8 bg-white shadow-md">
          <h2 className="mb-2 text-lg font-semibold text-gray-700">
            Tambah Merek Baru
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="flex-1 p-2 border rounded-md"
              placeholder="Nama Merek"
            />
            <button
              onClick={handleAddBrand}
              className="hover:bg-orange-500 px-4 py-2 text-white bg-orange-400 rounded-md"
            >
              Tambah
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {brands.map((brand) => (
          <div key={brand.id} className="p-4 bg-white rounded-md shadow-md">
            <div className="flex items-center justify-between mb-3">
              {editBrandId === brand.id ? (
                <>
                  <input
                    type="text"
                    value={editBrandName}
                    onChange={(e) => setEditBrandName(e.target.value)}
                    className="p-2 border rounded-md"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="hover:bg-green-600 px-3 py-1 text-sm text-white bg-green-500 rounded-md"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setEditBrandId(null)}
                      className="hover:bg-gray-500 px-3 py-1 text-sm text-white bg-gray-400 rounded-md"
                    >
                      Batal
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-lg font-medium text-gray-800">
                    {brand.name}
                  </span>
                  {isAdmin && ( // Hanya tampilkan tombol edit/hapus jika admin
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBrand(brand.id, brand.name)}
                        className="hover:bg-blue-600 px-3 py-1 text-sm text-white bg-blue-500 rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="hover:bg-red-600 px-3 py-1 text-sm text-white bg-red-500 rounded-md"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

```

## File: `pages\Checkout.jsx`

```
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useTransactions from "../hooks/useTransactions";
import useProducts from "../hooks/useProducts";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function Checkout() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  const { createTransaction } = useTransactions();
  const { getProductById } = useProducts();

  const [formData, setFormData] = useState({
    customer_name: "",
    shipping_address: "",
    payment_method: "Transfer Bank",
    purchased_size: "",
    purchased_color: "",
  });
  const [currentProductStock, setCurrentProductStock] = useState(
    product?.stock
  );

  useEffect(() => {
    const fetchLatestStock = async () => {
      if (product?.id) {
        try {
          const latestProduct = await getProductById(product.id);
          if (latestProduct) {
            setCurrentProductStock(latestProduct.stock);
          }
        } catch (err) {
          console.error("Gagal mengambil stok produk terbaru:", err);
          toast.error(
            "Gagal mendapatkan informasi produk terbaru. Silakan coba lagi."
          );
          navigate(-1);
        }
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchLatestStock();
      }
    }
  }, [product?.id, getProductById, navigate, user, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Silakan login untuk menyelesaikan pembelian.");
      navigate("/");
      return;
    }

    if (!product || currentProductStock <= 0) {
      toast.error(
        "Stok produk tidak tersedia atau informasi produk tidak lengkap."
      );
      return;
    }

    try {
      if (currentProductStock <= 0) {
        toast.error("Produk ini sudah habis stok.");
        return;
      }

      const transactionData = {
        product_id: product.id,
        customer_name: formData.customer_name,
        shipping_address: formData.shipping_address,
        payment_method: formData.payment_method,
        purchased_size: formData.purchased_size,
        purchased_color: formData.purchased_color,
      };

      const newTransaction = await createTransaction(transactionData);
      toast.success("Transaksi berhasil dibuat!");
      navigate("/payment", { state: { transaction: newTransaction } });
    } catch (err) {
      console.error("Gagal membuat transaksi:", err);
      toast.error("Gagal membuat transaksi: " + err.message);
    }
  };

  if (authLoading) {
    return <div className="p-8 text-center">Memuat checkout...</div>;
  }
  if (authError) {
    return (
      <div className="p-8 text-center text-red-600">Error: {authError}</div>
    );
  }
  if (!user) {
    return null;
  }
  if (!product) {
    return (
      <div className="p-8 text-red-600">
        Produk tidak ditemukan atau tidak dipilih.
      </div>
    );
  }
  if (currentProductStock === undefined) {
    return <div className="p-8 text-center">Memeriksa stok produk...</div>;
  }

  return (
    <div className="bg-nude flex justify-center min-h-screen p-8">
      <div className="md:flex-row flex flex-col w-full max-w-3xl gap-8 p-8 bg-white rounded-lg shadow-md">
        <div className="flex-1">
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-64 mb-4 rounded-md"
          />
          <h2 className="mb-1 text-xl font-bold">{product.name}</h2>
          <p className="mb-2 text-gray-600">{product.description}</p>
          <p className="mb-4 text-lg font-bold text-orange-500">
            Rp {parseFloat(product.price).toLocaleString("id-ID")}
          </p>
          <p
            className={`text-sm ${
              currentProductStock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            Stok: {currentProductStock} {currentProductStock <= 0 && "(Habis!)"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="customer_name"
              required
              value={formData.customer_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Alamat Pengiriman
            </label>
            <textarea
              name="shipping_address"
              required
              rows="3"
              value={formData.shipping_address}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Ukuran</label>
            <select
              name="purchased_size"
              value={formData.purchased_size}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Pilih Ukuran</option>
              {product.sizes?.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Warna</label>
            <select
              name="purchased_color"
              value={formData.purchased_color}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Pilih Warna</option>
              {product.colors?.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Metode Pembayaran
            </label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option>Transfer Bank</option>
              <option>QRIS</option>
              <option>COD</option>
            </select>
          </div>
          <button
            type="submit"
            className="hover:bg-green-600 w-full py-2 text-white bg-green-500 rounded-md"
            disabled={currentProductStock <= 0}
          >
            {currentProductStock <= 0 ? "Stok Habis" : "Konfirmasi Pembelian"}
          </button>
        </form>
      </div>
    </div>
  );
}

```

## File: `pages\Dashboard.jsx`

```
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useProducts from "../hooks/useProducts";
import useBrands from "../hooks/useBrands";
import useInspirations from "../hooks/useInspirations";
import useFavorites from "../hooks/useFavorites";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, loading: authLoading, error: authError, isAdmin } = useAuth();
  const {
    loading: productsLoading,
    error: productsError,
    getProducts,
  } = useProducts();
  const { loading: brandsLoading, error: brandsError, getBrands } = useBrands();
  const {
    loading: inspirationsLoading,
    error: inspirationsError,
    getInspirations,
  } = useInspirations();
  const {
    loading: favoritesLoading,
    error: favoritesError,
    getFavorites,
    addFavorite,
    removeFavorite,
  } = useFavorites();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [inspirationsCount, setInspirationsCount] = useState(0);
  const [brandsCount, setBrandsCount] = useState(0);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts || []);
      } catch (err) {
        console.error("Gagal mengambil produk:", err);
        toast.error("Gagal memuat produk: " + err.message);
      }

      try {
        const fetchedBrands = await getBrands();
        setBrands(fetchedBrands || []);
        setBrandsCount(fetchedBrands?.length || 0);
      } catch (err) {
        console.error("Gagal mengambil merek:", err);
        toast.error("Gagal memuat merek: " + err.message);
      }

      try {
        const fetchedInspirations = await getInspirations();
        setInspirationsCount(fetchedInspirations?.length || 0);
      } catch (err) {
        console.error("Gagal mengambil inspirasi:", err);
        toast.error("Gagal memuat inspirasi: " + err.message);
      }

      if (user) {
        try {
          const fetchedFavorites = await getFavorites();
          setFavorites(
            fetchedFavorites ? fetchedFavorites.map((fav) => fav.id) : []
          );
        } catch (err) {
          console.error("Gagal mengambil favorit:", err);
          toast.error("Gagal memuat favorit: " + err.message);
        }
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchData();
      }
    }
  }, [
    user,
    authLoading,
    getProducts,
    getBrands,
    getInspirations,
    getFavorites,
    navigate,
  ]);

  const toggleFavorite = async (productId) => {
    if (!user) {
      toast.error("Silakan login untuk menambahkan ke favorit.");
      return;
    }
    try {
      if (favorites.includes(productId)) {
        await removeFavorite(productId);
        setFavorites((prev) => prev.filter((id) => id !== productId));
        toast.success("Produk dihapus dari favorit!");
      } else {
        await addFavorite(productId);
        setFavorites((prev) => [...prev, productId]);
        toast.success("Produk ditambahkan ke favorit!");
      }
    } catch (err) {
      toast.error(`Gagal memperbarui favorit: ${err.message}`);
    }
  };

  if (
    authLoading ||
    productsLoading ||
    brandsLoading ||
    inspirationsLoading ||
    favoritesLoading
  )
    return <div className="p-8 text-center">Memuat data dashboard...</div>;
  if (
    authError ||
    productsError ||
    brandsError ||
    inspirationsError ||
    favoritesError
  )
    return (
      <div className="p-8 text-center text-red-600">
        Error memuat dashboard:{" "}
        {authError ||
          productsError ||
          brandsError ||
          inspirationsError ||
          favoritesError}
      </div>
    );
  if (!user) return null;

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-4 text-3xl font-bold text-center text-gray-800">
        Selamat Datang{" "}
        <span className="text-orange-500">
          {isAdmin ? "Admin" : "Wearspace Outfitly"}
        </span>
      </h1>
      <p className="mb-10 text-center text-gray-600">
        Kelola produk, merek, dan inspirasi fashion kamu dengan mudah!
      </p>

      {isAdmin && (
        <div className="md:grid-cols-3 grid grid-cols-1 gap-6 mb-10">
          <div className="rounded-xl p-6 text-center bg-white shadow">
            <p className="mb-1 text-gray-600">Total Produk</p>
            <p className="text-2xl font-bold text-orange-500">
              {products.length}
            </p>
          </div>
          <div className="rounded-xl p-6 text-center bg-white shadow">
            <p className="mb-1 text-gray-600">Total Merek</p>
            <p className="text-2xl font-bold text-orange-500">
              {brands.length}
            </p>
          </div>
          <div className="rounded-xl p-6 text-center bg-white shadow">
            <p className="mb-1 text-gray-600">Inspirasi Fashion</p>
            <p className="text-2xl font-bold text-orange-500">
              {inspirationsCount}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mb-10">
        {isAdmin && (
          <>
            <Link
              to="/products"
              className="hover:bg-orange-600 px-6 py-3 font-medium text-white bg-orange-500 rounded-md"
            >
              Kelola Produk
            </Link>
            <Link
              to="/brands"
              className="hover:bg-orange-600 px-6 py-3 font-medium text-white bg-orange-500 rounded-md"
            >
              Kelola Merek
            </Link>
          </>
        )}
        <Link
          to="/inspirations"
          className="hover:bg-orange-600 px-6 py-3 font-medium text-white bg-orange-500 rounded-md"
        >
          Lihat Inspirasi
        </Link>
      </div>

      <h2 className="mb-4 text-2xl font-bold text-gray-800">Katalog Produk</h2>
      <div className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid grid-cols-1 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl relative p-4 bg-white shadow"
          >
            <div className="top-3 right-3 absolute text-xl text-red-500 cursor-pointer">
              {favorites.includes(product.id) ? (
                <FaHeart onClick={() => toggleFavorite(product.id)} />
              ) : (
                <FaRegHeart onClick={() => toggleFavorite(product.id)} />
              )}
            </div>

            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-48 mb-3 rounded-md"
            />
            <h3 className="mb-1 text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="mb-2 text-sm text-gray-600">
              Merek:{" "}
              {brands.find((b) => b.id === product.brand_id)?.name || "N/A"}
            </p>
            <p className="mb-2 font-semibold text-orange-500">
              Rp {parseFloat(product.price).toLocaleString("id-ID")}
            </p>
            <div className="flex justify-between">
              <Link
                to={`/product/${product.id}`}
                className="text-sm text-blue-600"
              >
                Detail
              </Link>
              <Link
                to="/checkout"
                state={{ product }}
                className="hover:bg-green-600 px-4 py-1 text-sm text-white bg-green-500 rounded"
              >
                Beli
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

```

## File: `pages\DetailProduct.jsx`

```
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import useBrands from "../hooks/useBrands";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function DetailProduct() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loading: productLoading,
    error: productError,
    getProductById,
  } = useProducts();
  const { loading: brandsLoading, error: brandsError, getBrands } = useBrands();

  const [product, setProduct] = useState(null);
  const [brandName, setBrandName] = useState("N/A");

  useEffect(() => {
    const fetchDetailsAndBrand = async () => {
      try {
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);

        if (fetchedProduct?.brand_id) {
          try {
            const fetchedBrands = await getBrands();
            const foundBrand = fetchedBrands?.find(
              (b) => b.id === fetchedProduct.brand_id
            );
            if (foundBrand) {
              setBrandName(foundBrand.name);
            }
          } catch (err) {
            console.error("Gagal mengambil merek terkait produk:", err);
            toast.error("Gagal memuat data merek: " + err.message);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil detail produk:", err);
        toast.error("Gagal memuat detail produk: " + err.message);
      }
    };

    if (!authLoading) {
      fetchDetailsAndBrand();
    }
  }, [id, getProductById, getBrands, authLoading]); // Tambahkan getBrands ke dependensi

  // Hapus useEffect terpisah untuk fetchBrand karena sudah digabungkan di atas.
  // useEffect(() => {
  //   const fetchBrand = async () => { /* ... */ };
  //   if (product && !brandsLoading) {
  //     fetchBrand();
  //   }
  // }, [product, getBrands, brandsLoading]);

  if (authLoading || productLoading || brandsLoading)
    return <div className="p-8 text-center">Memuat detail produk...</div>;
  if (authError || productError || brandsError)
    return (
      <div className="p-8 text-center text-red-600">
        Error memuat produk: {authError || productError || brandsError}
      </div>
    );
  if (!product)
    return (
      <div className="p-8 text-center text-gray-600">
        Produk tidak ditemukan.
      </div>
    );

  return (
    <div className="bg-nude min-h-screen p-8">
      <div className="md:flex-row flex flex-col gap-8">
        <div className="md:w-1/2 w-full">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        <div className="md:w-1/2 w-full">
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            {product.name}
          </h2>
          <p className="mb-2 text-sm text-gray-600">Merek: {brandName}</p>
          <p className="mb-4 text-xl font-semibold text-orange-500">
            Rp {parseFloat(product.price).toLocaleString("id-ID")}
          </p>
          <p className="mb-4 text-gray-700">{product.description}</p>

          <div className="mb-4">
            <p className="mb-1 font-semibold">Ukuran Tersedia:</p>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 text-sm border rounded-md"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-1 font-semibold">Warna:</p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 text-sm border rounded-md"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          <p className="mb-2 text-sm text-gray-600">
            Bahan: {product.material}
          </p>
          <p className="mb-2 text-sm text-gray-600">
            Kategori: {product.category}
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Stok tersedia: {product.stock}
          </p>
          {user ? (
            <Link
              to="/checkout"
              state={{ product }}
              className="hover:bg-green-600 px-6 py-3 text-lg text-white bg-green-500 rounded-md"
            >
              Beli Sekarang
            </Link>
          ) : (
            <button
              onClick={() => {
                toast.info("Silakan login untuk membeli produk.");
                navigate("/login");
              }}
              className="hover:bg-blue-600 px-6 py-3 text-lg text-white bg-blue-500 rounded-md"
            >
              Login untuk Beli
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

```

## File: `pages\Favorites.jsx`

```
import React, { useEffect, useState } from "react";
import useFavorites from "../hooks/useFavorites";
import useProducts from "../hooks/useProducts";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Favorites() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const {
    loading: favoritesLoading,
    error: favoritesError,
    getFavorites,
    removeFavorite,
  } = useFavorites();
  const { loading: productsLoading, error: productsError } = useProducts();
  const navigate = useNavigate();

  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    const fetchAndFilterFavorites = async () => {
      try {
        const fetchedFavorites = await getFavorites();
        setFavoriteProducts(fetchedFavorites || []);
      } catch (err) {
        console.error("Gagal mengambil favorit:", err);
        toast.error("Gagal memuat favorit: " + err.message);
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchAndFilterFavorites();
      }
    }
  }, [getFavorites, user, authLoading, navigate]);

  const handleRemoveFavorite = async (productId) => {
    if (!user) {
      toast.error("Silakan login untuk menghapus dari favorit.");
      return;
    }
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus produk ini dari favorit?"
      )
    ) {
      try {
        await removeFavorite(productId);
        setFavoriteProducts((prev) => prev.filter((p) => p.id !== productId));
        toast.success("Produk berhasil dihapus dari favorit!");
      } catch (err) {
        toast.error(`Gagal menghapus favorit: ${err.message}`);
      }
    }
  };

  if (authLoading || favoritesLoading || productsLoading)
    return <div className="p-8 text-center">Memuat favorit...</div>;
  if (authError || favoritesError || productsError)
    return (
      <div className="p-8 text-center text-red-600">
        Error memuat favorit: {authError || favoritesError || productsError}
      </div>
    );
  if (!user) return null;

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">Favorit Saya</h1>
      <p className="mb-6 text-gray-600">
        Produk-produk yang Anda tandai sebagai favorit.
      </p>

      {favoriteProducts.length === 0 ? (
        <p className="text-gray-500">Belum ada produk favorit.</p>
      ) : (
        <div className="sm:grid-cols-2 md:grid-cols-3 grid grid-cols-1 gap-6">
          {favoriteProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-xl hover:shadow-lg p-4 transition bg-white shadow-md"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="object-cover w-full h-48 mb-3 rounded-md"
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h2>
              <p className="mb-1 text-sm text-gray-500">{product.brand_id}</p>
              <p className="mb-2 font-semibold text-orange-500">
                Rp {parseFloat(product.price).toLocaleString("id-ID")}
              </p>
              <button
                onClick={() => handleRemoveFavorite(product.id)}
                className="hover:bg-red-600 px-4 py-2 text-sm text-white bg-red-500 rounded-md"
              >
                Hapus dari Favorit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

```

## File: `pages\Inspirations.jsx`

```
import React, { useState, useEffect, useCallback } from "react";
import useInspirations from "../hooks/useInspirations";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function Inspirations() {
  const { loading: authLoading, error: authError } = useAuth();
  const {
    loading: inspirationsLoading,
    error: inspirationsError,
    getInspirations, // Ensure getInspirations from useInspirations is wrapped in useCallback
  } = useInspirations();
  const [inspirations, setInspirations] = useState([]);
  const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    // Only fetch if auth is not loading and getInspirations is stable
    if (!authLoading) {
      const handler = setTimeout(async () => {
        try {
          const fetchedInspirations = await getInspirations(searchTag);
          setInspirations(fetchedInspirations || []);
        } catch (err) {
          console.error("Gagal mengambil inspirasi:", err);
          toast.error("Gagal memuat inspirasi: " + err.message);
        }
      }, 300); // Debounce delay

      return () => clearTimeout(handler); // Cleanup on unmount or re-render
    }
  }, [getInspirations, searchTag, authLoading]); // Dependencies for useEffect

  // Render group for loading and error states
  if (authLoading || inspirationsLoading) {
    return (
      <div className="p-8 text-center text-gray-700">
        <p className="animate-pulse">Memuat inspirasi...</p>
      </div>
    );
  }

  if (authError || inspirationsError) {
    return (
      <div className="p-8 text-center text-red-600">
        Error:{" "}
        {authError?.message ||
          inspirationsError?.message ||
          "Terjadi kesalahan"}
      </div>
    );
  }

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">
        Inspirasi Outfit
      </h1>
      <p className="mb-6 text-gray-600">
        Rekomendasi tampilan pakaian berdasarkan aktivitas harianmu.
      </p>

      {/* Input Group */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Cari outfit untuk... (misal: kampus, pesta, olahraga)"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          className="md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full p-3 border rounded-md"
        />
      </div>

      {/* Inspirations Grid */}
      <div className="md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-6">
        {inspirations.length > 0 ? (
          inspirations.map((inspo) => (
            <div
              key={inspo.id}
              className="rounded-xl hover:shadow-lg overflow-hidden transition-shadow duration-300 bg-white shadow-md"
            >
              <img
                src={inspo.image_url}
                alt={inspo.title}
                className="object-cover w-full h-56"
              />
              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  {inspo.title}
                </h2>
                <p className="line-clamp-2 text-sm text-gray-600">
                  {inspo.description}
                </p>
                <p className="mt-2 text-xs text-gray-500">Tags: {inspo.tag}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-3 text-center text-gray-500">
            Tidak ada inspirasi ditemukan untuk pencarian Anda.
          </div>
        )}
      </div>
    </div>
  );
}

```

## File: `pages\Invoice.jsx`

```
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Invoice() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const transaction = state?.transaction;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return <div className="p-8 text-center">Memuat faktur...</div>;
  }
  if (authError) {
    return (
      <div className="p-8 text-center text-red-600">Error: {authError}</div>
    );
  }
  if (!user) {
    return null;
  }
  if (!transaction) {
    return (
      <div className="p-8 text-red-600">Data transaksi tidak ditemukan.</div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-nude min-h-screen p-8">
      <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Faktur Transaksi
        </h1>
        <p className="mb-2">
          <strong>ID Transaksi:</strong> {transaction.id}
        </p>
        <p className="mb-2">
          <strong>Nama Pelanggan:</strong> {transaction.customer_name}
        </p>
        <p className="mb-2">
          <strong>Alamat Pengiriman:</strong> {transaction.shipping_address}
        </p>
        <p className="mb-2">
          <strong>Metode Pembayaran:</strong> {transaction.payment_method}
        </p>
        <p className="mb-2">
          <strong>Status:</strong> {transaction.transaction_status}
        </p>
        <p className="mb-4">
          <strong>Tanggal:</strong>{" "}
          {new Date(transaction.transaction_date).toLocaleString()}
        </p>

        <hr className="my-4" />

        <div className="flex gap-4">
          {transaction.product?.image_url && (
            <img
              src={transaction.product.image_url}
              alt={transaction.product.name}
              className="object-cover w-32 h-32 rounded-md"
            />
          )}
          <div>
            <p className="text-lg font-semibold">
              {transaction.product?.name || "Produk Tidak Ditemukan"}
            </p>
            <p className="text-sm text-gray-500">
              ID Merek: {transaction.product?.brand_id || "N/A"}
            </p>
            <p className="text-sm">Ukuran: {transaction.purchased_size}</p>
            <p className="text-sm">Warna: {transaction.purchased_color}</p>
            <p className="mt-2 font-bold text-orange-500">
              Rp{" "}
              {parseFloat(transaction.product?.price).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/transactions")}
            className="hover:bg-gray-500 px-4 py-2 text-white bg-gray-400 rounded-md"
          >
            Kembali
          </button>
          <button
            onClick={handlePrint}
            className="hover:bg-green-600 px-4 py-2 text-white bg-green-500 rounded-md"
          >
            Cetak Faktur
          </button>
        </div>
      </div>
    </div>
  );
}

```

## File: `pages\Katalog.jsx`

```
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import useBrands from "../hooks/useBrands";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function Katalog() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();
  const {
    loading: productsLoading,
    error: productsError,
    getProducts,
  } = useProducts();
  const { loading: brandsLoading, error: brandsError, getBrands } = useBrands();

  const [products, setProducts] = useState([]);
  const [brandsMap, setBrandsMap] = useState({});

  useEffect(() => {
    const fetchCatalogData = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts || []);
      } catch (err) {
        console.error("Gagal mengambil produk untuk katalog:", err);
        toast.error("Gagal memuat produk: " + err.message);
      }

      try {
        const fetchedBrands = await getBrands();
        const map = {};
        fetchedBrands?.forEach((brand) => {
          map[brand.id] = brand.name;
        });
        setBrandsMap(map);
      } catch (err) {
        console.error("Gagal mengambil merek untuk katalog:", err);
        toast.error("Gagal memuat merek: " + err.message);
      }
    };
    if (!authLoading) {
      fetchCatalogData();
    }
  }, [getProducts, getBrands, authLoading]);

  if (authLoading || productsLoading || brandsLoading)
    return (
      <div className="bg-nude min-h-screen p-8 text-center">
        Memuat katalog...
      </div>
    );
  if (authError || productsError || brandsError)
    return (
      <div className="bg-nude min-h-screen p-8 text-center text-red-600">
        Error memuat produk: {authError || productsError || brandsError}
      </div>
    );

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
        Katalog Produk
      </h1>
      <div className="sm:grid-cols-2 md:grid-cols-3 grid grid-cols-1 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl hover:shadow-lg p-4 transition bg-white shadow-md"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-48 mb-3 rounded-md"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="mb-1 text-sm text-gray-500">
              Merek: {brandsMap[product.brand_id] || "N/A"}
            </p>
            <p className="mb-2 font-semibold text-orange-500">
              Rp {parseFloat(product.price).toLocaleString("id-ID")}
            </p>
            <p className="mb-2 text-sm text-gray-600">Stok: {product.stock}</p>
            <div className="flex justify-between mt-2">
              <Link
                to={`/product/${product.id}`}
                className="hover:underline text-sm text-blue-600"
              >
                Lihat Detail
              </Link>
              {user ? (
                <Link
                  to="/checkout"
                  state={{ product }}
                  className="hover:bg-green-600 px-3 py-1 text-sm text-white bg-green-500 rounded"
                >
                  Beli
                </Link>
              ) : (
                <button
                  onClick={() => {
                    toast.info("Silakan login untuk membeli produk.");
                    navigate("/login");
                  }}
                  className="hover:bg-blue-600 px-3 py-1 text-sm text-white bg-blue-500 rounded"
                >
                  Login untuk Beli
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

```

## File: `pages\Login.jsx`

```
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

```

## File: `pages\Navbar.jsx`

```
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

```

## File: `pages\Payment.jsx`

```
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useTransactions from "../hooks/useTransactions";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function Payment() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialTransaction = state?.transaction;

  const { updateTransactionStatus, getTransactionById } = useTransactions();
  const [transaction, setTransaction] = useState(initialTransaction);

  useEffect(() => {
    const fetchLatestTransaction = async () => {
      if (initialTransaction?.id) {
        try {
          const fetchedTransaction = await getTransactionById(
            initialTransaction.id
          );
          if (fetchedTransaction) {
            setTransaction(fetchedTransaction);
          }
        } catch (err) {
          console.error(
            "Gagal mengambil detail transaksi untuk pembayaran:",
            err
          );
          toast.error("Gagal memuat detail pembayaran. Silakan coba lagi.");
          navigate("/transactions");
        }
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else if (!initialTransaction) {
        navigate("/transactions");
      } else {
        fetchLatestTransaction();
      }
    }
  }, [initialTransaction, getTransactionById, navigate, user, authLoading]);

  const handleSuccess = async () => {
    if (!user) {
      toast.error("Silakan login untuk mengkonfirmasi pembayaran.");
      navigate("/");
      return;
    }
    if (!transaction) return;
    try {
      await updateTransactionStatus(transaction.id, "Berhasil");
      toast.success("Pembayaran berhasil dikonfirmasi!");
      navigate("/success");
    } catch (err) {
      toast.error(`Gagal memperbarui status pembayaran: ${err.message}`);
    }
  };

  if (authLoading) {
    return <div className="p-8 text-center">Memuat detail pembayaran...</div>;
  }
  if (authError) {
    return (
      <div className="p-8 text-center text-red-600">Error: {authError}</div>
    );
  }
  if (!user) {
    return null;
  }
  if (!transaction) {
    return <div className="p-8 text-red-600">Transaksi tidak ditemukan.</div>;
  }

  return (
    <div className="bg-nude flex justify-center min-h-screen p-8">
      <div className="w-full max-w-xl p-6 bg-white rounded-md shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Pembayaran</h1>

        <p className="mb-4">
          Total yang harus dibayar:{" "}
          <strong>
            Rp {parseFloat(transaction.product?.price).toLocaleString("id-ID")}
          </strong>
        </p>

        {transaction.payment_method === "QRIS" ? (
          <div className="text-center">
            <img src="/qris-example.png" alt="QRIS" className="w-64 mx-auto" />
            <p className="mt-2 text-sm text-gray-600">
              Pindai kode QR untuk menyelesaikan pembayaran
            </p>
          </div>
        ) : transaction.payment_method === "Transfer Bank" ? (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Pilih Bank
              </label>
              <select className="w-full p-2 border rounded-md">
                <option>Bank BRI</option>
                <option>Bank BCA</option>
                <option>Bank Mandiri</option>
                <option>Bank BNI</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Silakan transfer ke: <strong>123-456-7890</strong> a.n Wearspace
              Outfitly
            </div>
          </div>
        ) : (
          <p className="text-gray-600">
            Silakan bayar di tempat saat produk sampai (COD).
          </p>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/invoice", { state: { transaction } })}
            className="hover:bg-blue-600 px-4 py-2 text-white bg-blue-500 rounded-md"
          >
            Lihat Faktur
          </button>
          <button
            onClick={handleSuccess}
            className="hover:bg-green-600 px-4 py-2 text-white bg-green-500 rounded-md"
          >
            Saya Sudah Bayar
          </button>
        </div>
      </div>
    </div>
  );
}

```

## File: `pages\Products.jsx`

```
import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useProducts from "../hooks/useProducts";
import useBrands from "../hooks/useBrands";
import useFavorites from "../hooks/useFavorites";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Products() {
  const { user, loading: authLoading, error: authError, isAdmin } = useAuth();
  const {
    loading: productsLoading,
    error: productsError,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const { loading: brandsLoading, error: brandsError, getBrands } = useBrands();
  const {
    loading: favoritesLoading,
    error: favoritesError,
    getFavorites,
    addFavorite,
    removeFavorite,
  } = useFavorites();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [editProductId, setEditProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand_id: "",
    price: "",
    stock: "",
    sizes: [],
    colors: [],
    image_url: "",
    description: "",
    material: "",
    category: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts || []);
      } catch (err) {
        console.error("Gagal mengambil produk:", err);
        toast.error("Gagal memuat produk: " + err.message);
      }
      try {
        const fetchedBrands = await getBrands();
        setBrands(fetchedBrands || []);
      } catch (err) {
        console.error("Gagal mengambil merek:", err);
        toast.error("Gagal memuat merek: " + err.message);
      }
      if (user) {
        try {
          const fetchedFavorites = await getFavorites();
          setFavorites(
            fetchedFavorites ? fetchedFavorites.map((fav) => fav.id) : []
          );
        } catch (err) {
          console.error("Gagal mengambil favorit:", err);
          toast.error("Gagal memuat favorit: " + err.message);
        }
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchData();
      }
    }
  }, [getProducts, getBrands, getFavorites, user, authLoading, navigate]);

  const toggleFavorite = async (productId) => {
    if (!user) {
      toast.error("Silakan login untuk memperbarui favorit.");
      return;
    }
    try {
      if (favorites.includes(productId)) {
        await removeFavorite(productId);
        setFavorites((prev) => prev.filter((id) => id !== productId));
        toast.success("Produk dihapus dari favorit!");
      } else {
        await addFavorite(productId);
        setFavorites((prev) => [...prev, productId]);
        toast.success("Produk ditambahkan ke favorit!");
      }
    } catch (err) {
      toast.error(`Gagal memperbarui favorit: ${err.message}`);
    }
  };

  const handleEditClick = (product) => {
    if (!isAdmin) {
      // Hanya admin yang bisa mengedit
      toast.error("Anda tidak memiliki izin untuk mengedit produk.");
      return;
    }
    setEditProductId(product.id);
    setEditProductData({
      ...product,
      sizes: product.sizes ? product.sizes.join(", ") : "",
      colors: product.colors ? product.colors.join(", ") : "",
    });
  };

  const handleChange = (e, isNew = false) => {
    const { name, value } = e.target;
    if (isNew) {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    } else {
      setEditProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEdit = async () => {
    if (!isAdmin) {
      // Hanya admin yang bisa menyimpan perubahan
      toast.error("Anda tidak memiliki izin untuk menyimpan perubahan produk.");
      return;
    }
    try {
      const dataToSave = {
        ...editProductData,
        price: parseFloat(editProductData.price),
        stock: parseInt(editProductData.stock),
        sizes: editProductData.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        colors: editProductData.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      };
      await updateProduct(editProductId, dataToSave);
      await getProducts().then(setProducts);
      setEditProductId(null);
      toast.success("Produk berhasil diperbarui!");
    } catch (err) {
      toast.error(`Gagal memperbarui produk: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      // Hanya admin yang bisa menghapus
      toast.error("Anda tidak memiliki izin untuk menghapus produk.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await deleteProduct(id);
        await getProducts().then(setProducts);
        toast.success("Produk berhasil dihapus!");
      } catch (err) {
        toast.error(`Gagal menghapus produk: ${err.message}`);
      }
    }
  };

  const handleAddProduct = async () => {
    if (!isAdmin) {
      // Hanya admin yang bisa menambah
      toast.error("Anda tidak memiliki izin untuk menambahkan produk.");
      return;
    }
    try {
      const dataToCreate = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        sizes: newProduct.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        colors: newProduct.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      };

      if (
        !dataToCreate.name ||
        !dataToCreate.brand_id ||
        isNaN(dataToCreate.price) ||
        isNaN(dataToCreate.stock)
      ) {
        toast.warning(
          "Harap isi semua bidang yang diperlukan (Nama, Merek, Harga, Stok)."
        );
        return;
      }

      await createProduct(dataToCreate);
      await getProducts().then(setProducts);
      setNewProduct({
        name: "",
        brand_id: "",
        price: "",
        stock: "",
        sizes: [],
        colors: [],
        image_url: "",
        description: "",
        material: "",
        category: "",
      });
      setShowAddForm(false);
      toast.success("Produk berhasil ditambahkan!");
    } catch (err) {
      toast.error(`Gagal menambahkan produk: ${err.message}`);
    }
  };

  if (authLoading || productsLoading || brandsLoading || favoritesLoading)
    return <div className="p-8 text-center">Memuat data...</div>;
  if (authError || productsError || brandsError || favoritesError)
    return (
      <div className="p-8 text-center text-red-600">
        Error memuat produk:{" "}
        {authError || productsError || brandsError || favoritesError}
      </div>
    );
  if (!user) return null;

  return (
    <div className="bg-nude min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Produk</h1>
        {isAdmin && ( // Hanya tampilkan tombol tambah produk jika admin
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="hover:bg-orange-500 px-4 py-2 text-white transition bg-orange-400 rounded-md shadow-md"
          >
            {showAddForm ? "Tutup Form" : "+ Tambah Produk"}
          </button>
        )}
      </div>

      {isAdmin &&
        showAddForm && ( // Hanya tampilkan form tambah jika admin dan form dibuka
          <div className="rounded-xl p-4 mb-6 bg-white shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Form Tambah Produk</h2>
            <div className="md:grid-cols-2 grid grid-cols-1 gap-4">
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={(e) => handleChange(e, true)}
                placeholder="Nama Produk"
                className="p-2 border rounded-md"
              />
              <select
                name="brand_id"
                value={newProduct.brand_id}
                onChange={(e) => handleChange(e, true)}
                className="p-2 border rounded-md"
              >
                <option value="">Pilih Merek</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={(e) => handleChange(e, true)}
                placeholder="Harga"
                className="p-2 border rounded-md"
              />
              <input
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={(e) => handleChange(e, true)}
                placeholder="Stok"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="sizes"
                value={newProduct.sizes}
                onChange={(e) => handleChange(e, true)}
                placeholder="Ukuran (contoh: S, M, L)"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="colors"
                value={newProduct.colors}
                onChange={(e) => handleChange(e, true)}
                placeholder="Warna (contoh: Merah, Biru)"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="image_url"
                value={newProduct.image_url}
                onChange={(e) => handleChange(e, true)}
                placeholder="URL Gambar"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="description"
                value={newProduct.description}
                onChange={(e) => handleChange(e, true)}
                placeholder="Deskripsi"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="material"
                value={newProduct.material}
                onChange={(e) => handleChange(e, true)}
                placeholder="Bahan"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={(e) => handleChange(e, true)}
                placeholder="Kategori"
                className="p-2 border rounded-md"
              />
            </div>
            <button
              onClick={handleAddProduct}
              className="hover:bg-green-600 px-4 py-2 mt-4 text-white bg-green-500 rounded-md"
            >
              Simpan Produk
            </button>
          </div>
        )}

      <div className="sm:grid-cols-2 md:grid-cols-3 grid grid-cols-1 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl hover:shadow-lg relative p-4 transition bg-white shadow-md"
          >
            <div className="top-3 right-3 absolute text-lg text-red-500 cursor-pointer">
              {favorites.includes(product.id) ? (
                <FaHeart onClick={() => toggleFavorite(product.id)} />
              ) : (
                <FaRegHeart onClick={() => toggleFavorite(product.id)} />
              )}
            </div>

            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-48 mb-3 rounded-md"
            />

            {editProductId === product.id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editProductData.name}
                  onChange={handleChange}
                  placeholder="Nama Produk"
                  className="w-full p-1 mb-1 border rounded"
                />
                <select
                  name="brand_id"
                  value={editProductData.brand_id}
                  onChange={handleChange}
                  className="w-full p-1 mb-1 border rounded"
                >
                  <option value="">Pilih Merek</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="price"
                  value={editProductData.price}
                  onChange={handleChange}
                  placeholder="Harga"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="number"
                  name="stock"
                  value={editProductData.stock}
                  onChange={handleChange}
                  placeholder="Stok"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="text"
                  name="sizes"
                  value={editProductData.sizes}
                  onChange={handleChange}
                  placeholder="Ukuran (contoh: S, M, L)"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="text"
                  name="colors"
                  value={editProductData.colors}
                  onChange={handleChange}
                  placeholder="Warna (contoh: Merah, Biru)"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="text"
                  name="image_url"
                  value={editProductData.image_url}
                  onChange={handleChange}
                  placeholder="URL Gambar"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="text"
                  name="description"
                  value={editProductData.description}
                  onChange={handleChange}
                  placeholder="Deskripsi"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="text"
                  name="material"
                  value={editProductData.material}
                  onChange={handleChange}
                  placeholder="Bahan"
                  className="w-full p-1 mb-1 border rounded"
                />
                <input
                  type="text"
                  name="category"
                  value={editProductData.category}
                  onChange={handleChange}
                  placeholder="Kategori"
                  className="w-full p-1 mb-1 border rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="hover:bg-green-600 px-3 py-1 text-sm text-white bg-green-500 rounded-md"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditProductId(null)}
                    className="hover:bg-gray-500 px-3 py-1 text-sm text-white bg-gray-400 rounded-md"
                  >
                    Batal
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h2>
                <p className="mb-1 text-sm text-gray-500">
                  Merek:{" "}
                  {brands.find((b) => b.id === product.brand_id)?.name || "N/A"}
                </p>
                <p className="mb-2 font-semibold text-orange-500">
                  Rp {parseFloat(product.price).toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-gray-600">Stok: {product.stock}</p>
                <p className="text-sm text-gray-600">
                  Ukuran: {product.sizes?.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  Warna: {product.colors?.join(", ")}
                </p>
                {isAdmin && ( // Hanya tampilkan tombol edit/hapus jika admin
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="hover:bg-blue-600 px-3 py-1 text-sm text-white bg-blue-500 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="hover:bg-red-600 px-3 py-1 text-sm text-white bg-red-500 rounded-md"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

```

## File: `pages\Register.jsx`

```
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

```

## File: `pages\Success.jsx`

```
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

```

## File: `pages\TransactionDetails.jsx`

```
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTransactions from "../hooks/useTransactions";
import useAuth from "../hooks/useAuth";

export default function TransactionDetail() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loading: transactionsLoading,
    error: transactionsError,
    getTransactionById,
  } = useTransactions();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const fetchedTransaction = await getTransactionById(id);
        setTransaction(fetchedTransaction);
      } catch (err) {
        console.error("Failed to fetch transaction details:", err);
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchTransaction();
      }
    }
  }, [id, getTransactionById, user, authLoading, navigate]);

  if (authLoading || transactionsLoading)
    return (
      <div className="bg-nude min-h-screen p-8">
        <div className="p-8 text-center">Loading transaction details...</div>
      </div>
    );
  if (authError || transactionsError)
    return (
      <div className="bg-nude min-h-screen p-8">
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          Error: {authError || transactionsError}
        </h1>
        <button
          onClick={() => navigate("/transactions")}
          className="hover:bg-orange-600 px-4 py-2 text-white bg-orange-500 rounded-md"
        >
          Kembali
        </button>
      </div>
    );
  if (!user) return null;
  if (!transaction)
    return (
      <div className="bg-nude min-h-screen p-8">
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          Transaksi tidak ditemukan
        </h1>
        <button
          onClick={() => navigate("/transactions")}
          className="hover:bg-orange-600 px-4 py-2 text-white bg-orange-500 rounded-md"
        >
          Kembali
        </button>
      </div>
    );

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Detail Transaksi
      </h1>
      <div className="rounded-xl max-w-xl p-6 mx-auto bg-white shadow-md">
        <p className="mb-2">
          <strong>Nama Pelanggan:</strong> {transaction.customer_name}
        </p>
        <p className="mb-2">
          <strong>Alamat Pengiriman:</strong> {transaction.shipping_address}
        </p>
        <p className="mb-2">
          <strong>Metode Pembayaran:</strong> {transaction.payment_method}
        </p>
        <p className="mb-2">
          <strong>Status:</strong> {transaction.transaction_status}
        </p>
        <p className="mb-4">
          <strong>Tanggal:</strong>{" "}
          {new Date(transaction.transaction_date).toLocaleString()}
        </p>

        <hr className="my-4" />
        <h2 className="mb-3 text-xl font-semibold">Produk</h2>

        <div className="flex items-center gap-4">
          {transaction.product?.image_url && (
            <img
              src={transaction.product.image_url}
              alt={transaction.product.name}
              className="object-cover w-32 h-32 rounded-md"
            />
          )}
          <div>
            <p className="text-lg font-semibold">
              {transaction.product?.name || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Brand ID: {transaction.product?.brand_id || "N/A"}
            </p>
            <p className="text-sm">Ukuran: {transaction.purchased_size}</p>
            <p className="text-sm">Warna: {transaction.purchased_color}</p>
            <p className="mt-2 font-bold text-orange-500">
              Rp{" "}
              {parseFloat(transaction.product?.price).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/transactions")}
          className="hover:bg-gray-500 px-4 py-2 mt-6 text-white bg-gray-400 rounded-md"
        >
          Kembali ke Riwayat
        </button>
      </div>
    </div>
  );
}

```

## File: `pages\Transactions.jsx`

```
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useTransactions from "../hooks/useTransactions";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

export default function Transactions() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const {
    loading: transactionsLoading,
    error: transactionsError,
    getTransactions,
    deleteTransaction,
  } = useTransactions();
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const fetchedTransactions = await getTransactions();
        setTransactions(fetchedTransactions || []);
      } catch (err) {
        console.error("Gagal mengambil transaksi:", err);
        toast.error("Gagal memuat transaksi: " + err.message);
      }
    };
    if (!authLoading) {
      if (!user) {
        navigate("/");
      } else {
        fetchTransactions();
      }
    }
  }, [getTransactions, user, authLoading, navigate]);

  const handleDelete = async (id) => {
    if (!user) {
      toast.error("Silakan login untuk menghapus transaksi.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        await deleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        toast.success("Transaksi berhasil dihapus!");
      } catch (err) {
        toast.error(`Gagal menghapus transaksi: ${err.message}`);
      }
    }
  };

  if (authLoading || transactionsLoading)
    return <div className="p-8 text-center">Memuat transaksi...</div>;
  if (authError || transactionsError)
    return (
      <div className="p-8 text-center text-red-600">
        Error: {authError || transactionsError}
      </div>
    );
  if (!user) return null;

  return (
    <div className="bg-nude min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Riwayat Transaksi
      </h1>

      {transactions.length === 0 ? (
        <p className="text-gray-600">Belum ada transaksi yang dilakukan.</p>
      ) : (
        <div className="space-y-6">
          {transactions.map((t) => (
            <div key={t.id} className="rounded-xl p-4 bg-white shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-lg font-semibold">
                    {t.product?.name || "Produk Tidak Ditemukan"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ukuran: {t.purchased_size} | Warna: {t.purchased_color}
                  </p>
                  <p className="text-sm text-gray-600">
                    Metode: {t.payment_method}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        t.transaction_status === "Berhasil"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {t.transaction_status}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Tanggal: {new Date(t.transaction_date).toLocaleString()}
                  </p>
                </div>
                {t.product?.image_url && (
                  <img
                    src={t.product.image_url}
                    alt={t.product.name}
                    className="object-cover w-24 h-24 rounded-md"
                  />
                )}
              </div>
              <div className="flex justify-between mt-3">
                <Link
                  to="/invoice"
                  state={{ transaction: t }}
                  className="hover:bg-blue-600 px-4 py-1 text-sm text-white bg-blue-500 rounded"
                >
                  Lihat Faktur
                </Link>
                {t.transaction_status === "Menunggu Pembayaran" && (
                  <Link
                    to="/payment"
                    state={{ transaction: t }}
                    className="hover:bg-orange-600 px-4 py-1 text-sm text-white bg-orange-500 rounded"
                  >
                    Bayar Sekarang
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(t.id)}
                  className="hover:bg-red-600 px-4 py-1 text-sm text-white bg-red-500 rounded"
                >
                  Hapus Transaksi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

```

## File: `services\api.js`

```
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:6543/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

```

## File: `store\index.js`

```
import { configureStore } from "@reduxjs/toolkit";
export default configureStore({ reducer: {} });

```

## File: `utils\checkSession.js`

```
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:6543";

const AUTH_COOKIE_NAME = "wearspace_auth";
const USER_DATA_COOKIE_NAME = "wearspace_user_data";

export async function checkSession() {
  try {
    const authCookie = Cookies.get(AUTH_COOKIE_NAME);
    const userDataString = Cookies.get(USER_DATA_COOKIE_NAME);

    if (userDataString) {
      try {
        const storedUser = JSON.parse(userDataString);
        if (authCookie && storedUser.id) {
          return storedUser;
        }
      } catch (e) {
        console.error("Failed to parse stored user data or invalid format:", e);
        Cookies.remove(USER_DATA_COOKIE_NAME);
      }
    }

    if (authCookie) {
      const userId = authCookie;
      try {
        const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const fetchedUser = await response.json();
          Cookies.set(USER_DATA_COOKIE_NAME, JSON.stringify(fetchedUser), {
            expires: 7,
          });
          return fetchedUser;
        } else {
          console.warn(
            "Backend session check failed, response not OK:",
            response.status
          );
          Cookies.remove(AUTH_COOKIE_NAME);
          Cookies.remove(USER_DATA_COOKIE_NAME);
          return null;
        }
      } catch (networkError) {
        console.error(
          "Network or API error during session check:",
          networkError
        );
        return null;
      }
    }

    return null;
  } catch (globalError) {
    console.error("Unexpected error during checkSession:", globalError);
    Cookies.remove(AUTH_COOKIE_NAME);
    Cookies.remove(USER_DATA_COOKIE_NAME);
    return null;
  }
}

export function clearSessionCookies() {
  Cookies.remove(AUTH_COOKIE_NAME);
  Cookies.remove(USER_DATA_COOKIE_NAME);
}

```
