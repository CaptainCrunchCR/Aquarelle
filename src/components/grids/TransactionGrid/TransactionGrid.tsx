"use client";
import React, { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction.types";
import TransactionGridProps from "@/interfaces/transaction-grid-props.interface";

import Box from "@mui/material/Box";

import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import themeQuartzCustom from "@/theme-aggrid";
import { formatToCurrency } from "@/services/formattingService";
ModuleRegistry.registerModules([AllCommunityModule]);

const TransactionGrid: React.FC<TransactionGridProps> = ({
  transactionHook,
  transactionType,
}) => {
  const { transactions } = transactionHook;
  const [rowData, setRowData] = useState<Transaction[]>([]);
  const [colDefs] = useState<ColDef<Transaction, unknown>[]>([
    {
      flex: 1,
      field: "amount",
      resizable: false,
      autoHeight: true,
      valueFormatter: (params) =>
        formatToCurrency(params.value as string | number),
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
      return [
        ...transactions.filter(
          (transaction) => transaction.type === transactionType
        ),
      ];
    });
  }, [transactions, transactionType]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "50vh",
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        theme={themeQuartzCustom}
      />
    </Box>
  );
};

export default TransactionGrid;
