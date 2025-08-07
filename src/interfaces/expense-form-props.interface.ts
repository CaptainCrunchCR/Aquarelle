import useExpenses from "@/hooks/useExpenses";

interface ExpenseFormProps {
  className?: string;
  expenseHook: ReturnType<typeof useExpenses>;
}

export default ExpenseFormProps;
