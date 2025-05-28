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
