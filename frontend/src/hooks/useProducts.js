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
