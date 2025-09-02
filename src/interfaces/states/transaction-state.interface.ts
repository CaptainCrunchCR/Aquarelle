import { Category } from "@/types/category.types";
import { Transaction } from "@/types/transaction.types";

interface TransactionsState {
  version: number;
  transactions: Transaction[];
  categories: Category[];
}

export default TransactionsState;
