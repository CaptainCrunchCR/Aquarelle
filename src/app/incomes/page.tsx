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

export default function Incomes() {
  const transactionHook = useTransactions();
  const [grandTotal, setGrandTotal] = useState<string>();

  useEffect(() => {
    const incomes = [...transactionHook.transactions]
      .filter((transaction) => transaction.type === TRANSACTION_TYPES.INCOME)
      .map((expense) => expense.amount);
    const parsedIncomes = parseFromStringCollectionToBig(incomes);
    /**
     * Calculate everything in a grand total
     */
    const total = calculateTotalAmount(parsedIncomes).toString();
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
              transactionType={TRANSACTION_TYPES.INCOME}
            />
          </Box>
          <Box>
            <DisplayBlock title="Total Incomes" description={grandTotal} />
          </Box>
        </Box>
        <TransactionGrid
          transactionHook={transactionHook}
          transactionType={TRANSACTION_TYPES.INCOME}
        />
        <Toaster />
      </Container>
    </>
  );
}
