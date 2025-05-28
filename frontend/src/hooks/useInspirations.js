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
