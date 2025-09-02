import { CategoryOptionType } from "@/types/category.types";
import { TransactionType } from "@/types/transaction.types";

interface TransactionFormState {
  description: string;
  amount: string;
  isDescriptionError: boolean;
  isAmountError: boolean;
  descriptionHelperText?: string;
  amountHelperText?: string;
  persistFormData?: boolean;
  transactionType: TransactionType;
  transactionCategory: CategoryOptionType;
}

export default TransactionFormState;
