import { TransactionType } from "@/types/transaction.types";
import useTransactions from "@/hooks/useTransactions";

interface TransactionFormProps {
  className?: string;
  transactionHook: ReturnType<typeof useTransactions>;
  transactionType: TransactionType;
}

export default TransactionFormProps;
