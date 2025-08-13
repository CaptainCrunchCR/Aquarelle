"use client";
import {
  calculateTotalAmount,
  parseFromStringCollectionToBig,
} from "@/services/calculationService";

import DisplayBlock from "@/components/DisplayBlock/DisplayBlock";
import TransactionForm from "@/components/forms/TransactionForm/TransactionForm";
import TransactionGrid from "@/components/grids/TransactionGrid/TransactionGrid";
import useTransactions from "@/hooks/useTransactions";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { formatToCurrency } from "@/services/formattingService";
import { TRANSACTION_TYPES } from "@/types/transaction.types";

export default function Expenses() {
  const transactionHook = useTransactions();
  const [grandTotal, setGrandTotal] = useState<string>();

  useEffect(() => {
    const expenses = [...transactionHook.transactions]
      .filter((transaction) => transaction.type === TRANSACTION_TYPES.EXPENSE)
      .map((transaction) => transaction.amount);
    const parsedExpenses = parseFromStringCollectionToBig(expenses);
    /**
     * Calculate everything in a grand total
     */
    const total = calculateTotalAmount(parsedExpenses).toString();
    setGrandTotal(() => formatToCurrency(total));
  }, [transactionHook.transactions]);

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ marginY: "2rem" }}
        className="transaction-container"
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
              transactionHook={transactionHook}
              transactionType={TRANSACTION_TYPES.EXPENSE}
            />
          </Box>
          <Box>
            <DisplayBlock title="Total Expenses" description={grandTotal} />
          </Box>
        </Box>
        <TransactionGrid
          transactionHook={transactionHook}
          transactionType={TRANSACTION_TYPES.EXPENSE}
        />
        <Toaster />
      </Container>
    </>
  );
}
