import useExpenses from "@/hooks/useExpenses";
interface ExpenseGridProps {
  className?: string;
  expenseHook: ReturnType<typeof useExpenses>;
}

export default ExpenseGridProps;
