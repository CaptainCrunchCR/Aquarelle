import { Category } from "./category.types";
import { CategoryOptionType } from "./category.types";

type TransactionFormAction =
  | { type: "setAmount"; payload: string }
  | { type: "setDescription"; payload: string }
  | { type: "setIsDescriptionError"; payload: boolean }
  | { type: "setIsAmountError"; payload: boolean }
  | { type: "setDescriptionHelperText"; payload: string }
  | { type: "setAmountHelperText"; payload: string }
  | { type: "setPersistFormData"; payload: boolean }
  | { type: "clearErrors" }
  | { type: "reset" }
  | { type: "setTransactionType"; payload: TransactionType }
  | { type: "setTransactionCategory"; payload: CategoryOptionType };

type TransactionsAction =
  | { type: "setVersion"; payload: number }
  | { type: "addSingleCategory"; payload: Category }
  | { type: "addSingleTransaction"; payload: Transaction }
  | { type: "initializeCategories"; payload: Category[] }
  | { type: "initializeTransactions"; payload: Transaction[] }
  | { type: "removeTransaction"; payload: string }
  | { type: "reset" };

type TransactionType = "income" | "expense";

const TRANSACTION_TYPES = {
  INCOME: "income" as const,
  EXPENSE: "expense" as const,
} as const;

type Transaction = {
  id: string;
  description: string;
  amount: string;
  type: TransactionType;
  categoryId: string;
  created_at: Date;
};

type Transactions = {
  version: number;
  transactions: Transaction[];
  categories: Category[];
};

export type {
  Transaction,
  TransactionFormAction,
  TransactionType,
  Transactions,
  TransactionsAction,
};

export { TRANSACTION_TYPES };
