import useTransactions from "@/hooks/useTransactions";

interface TransactionFormProps {
  className?: string;
  transactionHook: ReturnType<typeof useTransactions>;
}

export default TransactionFormProps;
