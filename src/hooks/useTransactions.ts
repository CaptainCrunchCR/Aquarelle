"use client";
import TransactionsState from "@/interfaces/states/transaction-state.interface";
import { Category } from "@/types/category.types";
import { Transaction, TransactionsAction } from "@/types/transaction.types";
import { useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

const useTransactions = () => {
  const transactionsReducer = (
    state: TransactionsState,
    action: TransactionsAction
  ): TransactionsState => {
    switch (action.type) {
      case "setVersion": {
        return {
          ...state,
          version: action.payload,
        };
      }
      case "addSingleCategory": {
        return {
          ...state,
          categories: [...state.categories, action.payload],
        };
      }
      case "initializeCategories": {
        return {
          ...state,
          categories: [...state.categories, ...action.payload],
        };
      }
      case "initializeTransactions": {
        return {
          ...state,
          transactions: [...action.payload],
        };
      }
      case "addSingleTransaction": {
        return {
          ...state,
          transactions: [...state.transactions, action.payload],
        };
      }
      case "reset": {
        return {
          version: 1,
          transactions: [],
          categories: [],
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(transactionsReducer, {
    version: 1,
    transactions: [],
    categories: [
      {
        id: uuidv4(),
        name: "Uncategorized",
      },
    ],
  });

  const addNewTransaction = (newExpense: Transaction) => {
    dispatch({ type: "addSingleTransaction", payload: newExpense });
  };

  const addNewCategory = (newCategory: Category) => {
    dispatch({ type: "addSingleCategory", payload: newCategory });
  };

  return {
    addNewCategory,
    addNewTransaction,
    state,
  };
};

export default useTransactions;
