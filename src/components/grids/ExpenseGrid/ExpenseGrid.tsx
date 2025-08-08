"use client";
import styles from "./ExpenseGrid.module.css";
import React, { useState, useEffect } from "react";
import { Expense } from "@/types/expense.types";
import ExpenseGridProps from "@/interfaces/expense-grid-props.interface";

import Box from "@mui/material/Box";

import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import themeQuartzCustom from "@/theme-aggrid";
import { formatToCurrency } from "@/services/formattingService";
ModuleRegistry.registerModules([AllCommunityModule]);

const ExpenseGrid: React.FC<ExpenseGridProps> = ({
  className,
  expenseHook,
}) => {
  const classNames = `${styles["expense-grid"]} ${className}`;
  const { expenses } = expenseHook;
  const [rowData, setRowData] = useState<Expense[]>([]);
  const [colDefs] = useState<ColDef<Expense, unknown>[]>([
    {
      flex: 1,
      field: "amount",
      resizable: false,
      autoHeight: true,
      valueFormatter: (params) => formatToCurrency(params.value),
    },
    {
      flex: 1,
      field: "description",
      resizable: false,
      autoHeight: true,
    },
  ]);

  useEffect(() => {
    setRowData(() => {
      return [...expenses];
    });
  }, [expenses]);

  return (
    <Box className={classNames}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        theme={themeQuartzCustom}
      />
    </Box>
  );
};

export default ExpenseGrid;
