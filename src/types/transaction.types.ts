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

type Transaction = {
  description: string;
  amount: string;
};

export type { TransactionFormAction, Transaction };
