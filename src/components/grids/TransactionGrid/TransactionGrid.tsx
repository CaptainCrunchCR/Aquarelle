"use client";
import {
  AllCommunityModule,
  ColDef,
  ICellRendererParams,
  ModuleRegistry,
  ValueFormatterParams,
} from "ag-grid-community";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TRANSACTION_TYPES, Transaction } from "@/types/transaction.types";
import {
  capitalizeString,
  formatDate,
  formatToCRCCurrency,
} from "@/services/formattingService";

import { AgGridReact } from "ag-grid-react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import IconButton from "@mui/material/Button";
import TransactionGridProps from "@/interfaces/properties/transaction-grid-props.interface";
import themeQuartzCustom from "@/theme-aggrid";
import toast from "react-hot-toast";

ModuleRegistry.registerModules([AllCommunityModule]);

const TransactionGrid: React.FC<TransactionGridProps> = ({
  transactionHook,
}) => {
  const { removeTransaction } = transactionHook;
  const [rowData, setRowData] = useState<Transaction[]>([]);

  const handleRemoveTransaction = useCallback(
    (transaction: Transaction | undefined) => {
      if (transaction === undefined) return;
      removeTransaction(transaction.id);
      toast.error(transaction.description + " was deleted.", {
        position: "bottom-left",
        duration: 5000,
      });
    },
    [removeTransaction]
  );

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
      {
        flex: 1,
        headerName: "Actions",
        resizable: false,
        autoHeight: true,
        cellRenderer: (params: ICellRendererParams<Transaction>) => {
          return (
            <IconButton
              sx={{ color: "error.dark" }}
              aria-label="delete"
              size="medium"
              onClick={() => handleRemoveTransaction(params.data)}
            >
              <DeleteIcon />
            </IconButton>
          );
        },
      },
    ],
    [transactionHook.state.categories, handleRemoveTransaction]
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
        animateRows={true}
        getRowId={(params) => params.data.id}
        deltaSort={true}
      />
    </Box>
  );
};

export default TransactionGrid;
