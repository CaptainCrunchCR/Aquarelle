type TransactionFormAction =
  | { type: "setAmount"; payload: string }
  | { type: "setDescription"; payload: string }
  | { type: "setIsDescriptionError"; payload: boolean }
  | { type: "setIsAmountError"; payload: boolean }
  | { type: "setDescriptionHelperText"; payload: string }
  | { type: "setAmountHelperText"; payload: string }
  | { type: "setPersistFormData"; payload: boolean }
  | { type: "clearErrors" }
  | { type: "reset" };

type TransactionType = "income" | "expense";

const TRANSACTION_TYPES = {
  INCOME: "income" as const,
  EXPENSE: "expense" as const,
} as const;

type Transaction = {
  description: string;
  amount: string;
  type: TransactionType;
};

export type { Transaction, TransactionFormAction, TransactionType };

export { TRANSACTION_TYPES };
