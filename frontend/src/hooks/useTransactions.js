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
