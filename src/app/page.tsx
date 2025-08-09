"use client";
import {
  calculateExpensesTotalAmount,
  parseFromStringCollectionToBig,
} from "@/services/calculationService";
import styles from "./page.module.css";

import DisplayBlock from "@/components/DisplayBlock/DisplayBlock";
import TransactionForm from "@/components/forms/TransactionForm/TransactionForm";
import TransactionGrid from "@/components/grids/TransactionGrid/TransactionGrid";
import useTransactions from "@/hooks/useTransactions";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { formatToCurrency } from "@/services/formattingService";

export default function Home() {
  const transactionHook = useTransactions();
  const [grandTotal, setGrandTotal] = useState<string>();

  useEffect(() => {
    const expenses = [...transactionHook.expenses].map(
      (expense) => expense.amount
    );
    const parsedExpenses = parseFromStringCollectionToBig(expenses);
    /**
     * Calculate everything in a grand total
     */
    const total = calculateExpensesTotalAmount(parsedExpenses).toString();
    setGrandTotal(() => formatToCurrency(total));
  }, [transactionHook.expenses]);

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
            <TransactionForm
              className={styles["expense-container-item"]}
              transactionHook={transactionHook}
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
        <TransactionGrid
          className={styles["expense-container-item"]}
          transactionHook={transactionHook}
        />
        <Toaster />
      </Container>
    </>
  );
}
