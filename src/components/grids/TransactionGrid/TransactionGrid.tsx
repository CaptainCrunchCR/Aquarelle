"use client";
import Chip from "@mui/material/Chip";
import React, { useState, useEffect, useMemo } from "react";
import { Transaction, TRANSACTION_TYPES } from "@/types/transaction.types";
import TransactionGridProps from "@/interfaces/properties/transaction-grid-props.interface";

import Box from "@mui/material/Box";

import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  ValueFormatterParams,
  ICellRendererParams,
} from "ag-grid-community";
import themeQuartzCustom from "@/theme-aggrid";
import {
  capitalizeString,
  formatDate,
  formatToCRCCurrency,
} from "@/services/formattingService";
ModuleRegistry.registerModules([AllCommunityModule]);

const TransactionGrid: React.FC<TransactionGridProps> = ({
  transactionHook,
}) => {
  const [rowData, setRowData] = useState<Transaction[]>([]);
  const colDefs = useMemo<ColDef<Transaction, unknown>[]>(
    () => [
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
      {
        flex: 1,
        field: "categoryId",
        headerName: "Category",
        resizable: false,
        autoHeight: true,
        valueGetter: (params) => {
          if (!params.data)
            return transactionHook.state.categories[0]?.name ?? "";
          const selectedCategory = transactionHook.state.categories.find(
            (cat) => cat.id === params.data?.categoryId
          );
          return (
            selectedCategory?.name ??
            transactionHook.state.categories[0]?.name ??
            ""
          );
        },
        cellRenderer: (params: ICellRendererParams<Transaction>) => {
          if (!params.data)
            return transactionHook.state.categories[0]?.name ?? "";
          const selectedCategory = transactionHook.state.categories.find(
            (cat) => cat.id === params.data?.categoryId
          );

          return (
            <Chip
              label={
                selectedCategory?.name ??
                transactionHook.state.categories[0]?.name ??
                ""
              }
              color="primary"
            />
          );
        },
      },
      {
        flex: 1,
        field: "created_at",
        headerName: "Created At",
        resizable: false,
        autoHeight: true,
        valueFormatter: (params) => formatDate(params.value as Date),
      },
    ],
    [transactionHook.state.categories]
  );

  useEffect(() => {
    setRowData(() => {
      return [...transactionHook.state.transactions];
    });
  }, [transactionHook.state.transactions]);

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
