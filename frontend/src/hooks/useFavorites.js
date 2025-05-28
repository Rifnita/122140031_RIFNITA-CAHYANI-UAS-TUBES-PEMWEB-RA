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
