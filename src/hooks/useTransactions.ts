"use client";
import { Category } from "@/types/category.types";
import { Transaction, TransactionsAction } from "@/types/transaction.types";
import TransactionsState from "@/interfaces/states/transaction-state.interface";
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
      case "removeTransaction": {
        return {
          ...state,
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== action.payload
          ),
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

  const removeTransaction = (transactionId: string) => {
    if (transactionId === "") return;
    dispatch({ type: "removeTransaction", payload: transactionId });
  };

  const addNewCategory = (newCategory: Category) => {
    dispatch({ type: "addSingleCategory", payload: newCategory });
  };

  return {
    addNewCategory,
    addNewTransaction,
    removeTransaction,
    state,
  };
};

export default useTransactions;
