"use client";
import { Transaction } from "@/types/transaction.types";
import { useState, useEffect } from "react";

const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /**
   * Get transactions from local storage or create a new empty object instead.
   */
  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("transactions") ?? "[]"
    ) as Transaction[];
    if (stored.length > 0) {
      setTransactions(stored);
    }
  }, []);

  const addNewTransaction = (newExpense: Transaction) => {
    /**
     * Register transaction to hook transaction state, allowing to be shared with multiple components.
     */
    setTransactions((prevState) => {
      return [...prevState, newExpense];
    });
    /**
     * Register expense to localStorage
     */
    const transactions = JSON.parse(
      localStorage.getItem("transactions") ?? "[]"
    ) as Array<Transaction>;
    transactions.push(newExpense);
    localStorage.removeItem("transactions");
    localStorage.setItem("transactions", JSON.stringify(transactions));
  };

  return {
    addNewTransaction,
    transactions,
  };
};

export default useTransactions;
