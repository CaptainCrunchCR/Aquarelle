"use client";
import React, { useState, useEffect } from "react";
import { Transaction, TRANSACTION_TYPES } from "@/types/transaction.types";
import TransactionGridProps from "@/interfaces/transaction-grid-props.interface";

import Box from "@mui/material/Box";

import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  ValueFormatterParams,
} from "ag-grid-community";
import themeQuartzCustom from "@/theme-aggrid";
import {
  capitalizeString,
  formatToCRCCurrency,
} from "@/services/formattingService";
ModuleRegistry.registerModules([AllCommunityModule]);

const TransactionGrid: React.FC<TransactionGridProps> = ({
  transactionHook,
}) => {
  const [rowData, setRowData] = useState<Transaction[]>([]);
  const [colDefs] = useState<ColDef<Transaction, unknown>[]>([
    {
      flex: 1,
      field: "amount",
      resizable: false,
      autoHeight: true,
      valueFormatter: (params) => formatAmount(params),
    },
    {
      flex: 1,
      field: "description",
      resizable: false,
      autoHeight: true,
      valueFormatter: (params) => capitalizeString(params.value as string),
    },
    {
      flex: 1,
      field: "type",
      resizable: false,
      autoHeight: true,
      valueFormatter: (params) => capitalizeString(params.value as string),
    },
  ]);

  useEffect(() => {
    setRowData(() => {
      return [...transactionHook.transactions];
    });
  }, [transactionHook.transactions]);

  const formatAmount = (params: ValueFormatterParams) => {
    const { amount, type } = params.data;
    let representation = amount;
    if (type === TRANSACTION_TYPES.EXPENSE) {
      if (typeof amount === "number") representation = -amount;
      else representation = "-".concat(amount);
    }
    return formatToCRCCurrency(representation);
  };

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
