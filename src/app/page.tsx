"use client";
import {
  calculateNetWorth,
  calculateTotalAdditionInAmount,
  calculateTotalSubstractionInAmount,
} from "@/services/calculationService";
import { parseFromStringCollectionToBig } from "@/services/formattingService";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import DisplayBlock from "@/components/DisplayBlock/DisplayBlock";
import TransactionForm from "@/components/forms/TransactionForm/TransactionForm";
import TransactionGrid from "@/components/grids/TransactionGrid/TransactionGrid";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import useTransactions from "@/hooks/useTransactions";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { formatToCRCCurrency } from "@/services/formattingService";
import { TRANSACTION_TYPES } from "@/types/transaction.types";

export default function Transactions() {
  const transactionHook = useTransactions();
  const [transactions, setTransactions] = useState({
    netWorth: "",
    incomes: "",
    expenses: "",
  });

  useEffect(() => {
    if (transactionHook.transactions.length === 0) return;
    const incomesData = transactionHook.transactions
      .filter((transaction) => transaction.type === TRANSACTION_TYPES.INCOME)
      .map((transaction) => transaction.amount);
    const expensesData = transactionHook.transactions
      .filter((transaction) => transaction.type === TRANSACTION_TYPES.EXPENSE)
      .map((transaction) => transaction.amount);

    const incomes = parseFromStringCollectionToBig(incomesData);
    const expenses = parseFromStringCollectionToBig(expensesData);

    setTransactions(() => ({
      netWorth: formatToCRCCurrency(
        calculateNetWorth(expenses, incomes).toString()
      ),
      incomes: formatToCRCCurrency(
        calculateTotalAdditionInAmount(incomes).toString()
      ),
      expenses: formatToCRCCurrency(
        calculateTotalSubstractionInAmount(expenses).toString()
      ),
    }));
  }, [transactionHook.transactions]);

  return (
    <Container maxWidth="xl" sx={{ marginY: "2rem" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          marginBottom: "1rem",
        }}
      >
        <Box flexGrow="1">
          <TransactionForm transactionHook={transactionHook} />
        </Box>
        {transactionHook.transactions.length > 0 && (
          <Box>
            <DisplayBlock
              title="Wallet"
              description={transactions.netWorth}
              icon={AccountBalanceWalletRoundedIcon}
            />
          </Box>
        )}
      </Box>
      {transactionHook.transactions.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
            marginBottom: "1rem",
          }}
        >
          <Box flexGrow="1">
            <DisplayBlock
              description={transactions.incomes}
              icon={TrendingUpRoundedIcon}
              color="success"
              variant="compact"
            />
          </Box>
          <Box flexGrow="1">
            <DisplayBlock
              description={transactions.expenses}
              icon={TrendingDownRoundedIcon}
              color="error"
              variant="compact"
            />
          </Box>
        </Box>
      )}
      <TransactionGrid transactionHook={transactionHook} />
      <Toaster />
    </Container>
  );
}
