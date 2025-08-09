"use client";
import { Transaction } from "@/types/transaction.types";
import { useState, useEffect } from "react";

const useTransactions = () => {
  const [expenses, setExpenses] = useState<Transaction[]>([]);

  /**
   * Get expenses from local storage or create a new empty object instead.
   */
  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("expenses") ?? "[]"
    ) as Transaction[];
    setExpenses(stored.length > 0 ? stored : []);
  }, []);

  const addNewExpense = (newExpense: Transaction) => {
    /**
     * Register expense to hook expense state, allowing to be shared with multiple components.
     */
    setExpenses((prevState) => {
      return [...prevState, newExpense];
    });
    /**
     * Register expense to localStorage
     */
    const expenses = JSON.parse(
      localStorage.getItem("expenses") ?? "[]"
    ) as Array<Transaction>;
    expenses.push(newExpense);
    localStorage.removeItem("expenses");
    localStorage.setItem("expenses", JSON.stringify(expenses));
    console.info("Registered to local storage...");
  };

  return {
    addNewExpense,
    expenses,
  };
};

export default useTransactions;
