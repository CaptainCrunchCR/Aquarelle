"use client";
import styles from "./page.module.css";

import ExpenseForm from "@/components/forms/ExpenseForm/ExpenseForm";
import ExpenseGrid from "@/components/grids/ExpenseGrid/ExpenseGrid";
import useExpenses from "@/hooks/useExpenses";
import Container from "@mui/material/Container";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const expenseHook = useExpenses();
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ marginY: "2rem" }}
        className="expense-container"
      >
        <ExpenseForm
          className={styles["expense-container-item"]}
          expenseHook={expenseHook}
        />
        <ExpenseGrid
          className={styles["expense-container-item"]}
          expenseHook={expenseHook}
        />
        <Toaster />
      </Container>
    </>
  );
}
