import useTransactions from "@/hooks/useTransactions";
interface TransactionGridProps {
  className?: string;
  transactionHook: ReturnType<typeof useTransactions>;
}

export default TransactionGridProps;
