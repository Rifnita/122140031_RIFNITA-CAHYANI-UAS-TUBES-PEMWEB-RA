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
