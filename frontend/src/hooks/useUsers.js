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
