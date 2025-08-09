"use client";
import {
  calculateExpensesTotalAmount,
  parseFromStringCollectionToBig,
} from "@/services/expenseService";
import styles from "./page.module.css";

import DisplayBlock from "@/components/DisplayBlock/DisplayBlock";
import ExpenseForm from "@/components/forms/ExpenseForm/ExpenseForm";
import ExpenseGrid from "@/components/grids/ExpenseGrid/ExpenseGrid";
import useExpenses from "@/hooks/useExpenses";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { formatToCurrency } from "@/services/formattingService";

export default function Home() {
  const expenseHook = useExpenses();
  const [grandTotal, setGrandTotal] = useState<string>();

  useEffect(() => {
    const expenses = [...expenseHook.expenses].map((expense) => expense.amount);
    const parsedExpenses = parseFromStringCollectionToBig(expenses);
    /**
     * Calculate everything in a grand total
     */
    const total = calculateExpensesTotalAmount(parsedExpenses).toString();
    setGrandTotal(() => formatToCurrency(total));
  }, [expenseHook.expenses]);

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ marginY: "2rem" }}
        className="expense-container"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box flexGrow="1">
            <ExpenseForm
              className={styles["expense-container-item"]}
              expenseHook={expenseHook}
            />
          </Box>
          <Box>
            <DisplayBlock
              title="Grand Total"
              className={styles["expense-container-item"]}
              description={grandTotal}
            />
          </Box>
        </Box>
        <ExpenseGrid
          className={styles["expense-container-item"]}
          expenseHook={expenseHook}
        />
        <Toaster />
      </Container>
    </>
  );
}
