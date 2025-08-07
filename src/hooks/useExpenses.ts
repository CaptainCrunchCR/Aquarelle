"use client";
import { Expense } from "@/types/expense.types";
import { useState, useEffect } from "react";

const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  /**
   * Get expenses from local storage or create a new empty object instead.
   */
  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("expenses") ?? "[]"
    ) as Expense[];
    setExpenses(stored.length > 0 ? stored : []);
  }, []);

  const addNewExpense = (newExpense: Expense) => {
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
    ) as Array<Expense>;
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

export default useExpenses;
