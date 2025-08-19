"use client";

import TransactionFormState from "@/interfaces/transaction-form-state.interface";
import TransactionFormProps from "@/interfaces/transaction-form-props.interface";
import { TransactionFormAction, Transaction } from "@/types/transaction.types";
import TransactionFormSchema from "@/schemas/transaction-form.schema";

import React, { FC, useReducer, useEffect } from "react";
import * as zod from "zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import toast from "react-hot-toast";

const TransactionForm: FC<TransactionFormProps> = ({
  transactionHook,
  transactionType,
}) => {
  const { addNewTransaction } = transactionHook;
  const [, setIsClient] = React.useState(false);

  useEffect(() => {
    setIsClient(true);

    // Only access localStorage after client-side hydration
    const persistFormData = localStorage.getItem("persistFormData");
    let isPersistent = true; // default value

    if (persistFormData === null) {
      localStorage.setItem("persistFormData", JSON.stringify(true));
    } else {
      isPersistent = JSON.parse(persistFormData);
    }

    dispatch({ type: "setPersistFormData", payload: isPersistent });

    toast.success(
      `${isPersistent ? "Persist Form Data: ON" : "Persist Form Data: OFF"}`,
      {
        position: "bottom-left",
        duration: 5000,
      }
    );
  }, []);

  const transactionReducer = (
    state: TransactionFormState,
    action: TransactionFormAction
  ): TransactionFormState => {
    switch (action.type) {
      case "setDescription":
        return {
          ...state,
          description: action.payload,
        };
      case "setAmount":
        return {
          ...state,
          amount: action.payload,
        };
      case "reset":
        return {
          amount: "",
          description: "",
          isDescriptionError: false,
          isAmountError: false,
          descriptionHelperText: "",
          amountHelperText: "",
          persistFormData: state.persistFormData,
        };
      case "clearErrors":
        return {
          ...state,
          isDescriptionError: false,
          isAmountError: false,
          descriptionHelperText: "",
          amountHelperText: "",
        };
      case "setIsDescriptionError":
        return {
          ...state,
          isDescriptionError: action.payload,
        };
      case "setIsAmountError":
        return {
          ...state,
          isAmountError: action.payload,
        };
      case "setDescriptionHelperText":
        return {
          ...state,
          descriptionHelperText: action.payload,
        };
      case "setAmountHelperText":
        return {
          ...state,
          amountHelperText: action.payload,
        };
      case "setPersistFormData":
        return {
          ...state,
          persistFormData: action.payload,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(transactionReducer, {
    amount: "",
    description: "",
    isDescriptionError: false,
    isAmountError: false,
    descriptionHelperText: "",
    amountHelperText: "",
    persistFormData: true,
  });

  const handleFormValidation = () => {
    try {
      TransactionFormSchema.parse(state);
      dispatch({ type: "clearErrors" });
    } catch (error) {
      if (error instanceof zod.ZodError) {
        const paths = new Set();
        /**
         * Get all the errors logged by Zod and takes the first error for each property in the form, avoiding displaying multiple.
         */
        const normalizedErrors = error.issues
          .map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          }))
          .filter((issue) => {
            if (paths.has(issue.path)) return false;
            paths.add(issue.path);
            return true;
          });

        const descriptionError = normalizedErrors.find(
          (error) => error.path === "description"
        );
        const amountError = normalizedErrors.find(
          (error) => error.path === "amount"
        );
        if (descriptionError) {
          dispatch({ type: "setIsDescriptionError", payload: true });
          dispatch({
            type: "setDescriptionHelperText",
            payload: descriptionError.message,
          });
        } else {
          dispatch({ type: "setIsDescriptionError", payload: false });
          dispatch({ type: "setDescriptionHelperText", payload: "" });
        }

        if (amountError) {
          dispatch({ type: "setIsAmountError", payload: true });
          dispatch({
            type: "setAmountHelperText",
            payload: amountError.message,
          });
        } else {
          dispatch({ type: "setIsAmountError", payload: false });
          dispatch({ type: "setAmountHelperText", payload: "" });
        }
      }
      throw error;
    }
  };

  const handleFormSubmit = () => {
    try {
      handleFormValidation();
      const transactions = JSON.parse(
        localStorage.getItem("transactions") ?? "[]"
      ) as Array<Transaction>;
      if (transactions.length === 0) {
        addNewTransaction({
          description: state.description,
          amount: state.amount,
          type: transactionType,
        } as Transaction);
      } else {
        const currentStateStored = transactions.find(
          (e) =>
            e.amount === state.amount &&
            e.description === state.description &&
            e.type === e.type
        );
        if (currentStateStored) {
          toast.error(
            `🙅‍♂️ ${state.description} was already added to your ${transactionType}s!`,
            {
              position: "bottom-left",
              duration: 5000,
            }
          );
          return;
        }
        addNewTransaction({
          description: state.description,
          amount: state.amount,
          type: transactionType,
        } as Transaction);
      }

      toast.success(
        `🎉 ${state.description} added to your ${transactionType}s!`,
        {
          position: "bottom-left",
          duration: 5000,
        }
      );

      if (!state.persistFormData) dispatch({ type: "reset" });
    } catch {
      return;
    }
  };

  const handleTogglePersistFormData = () => {
    if (typeof window === "undefined") return true;
    const toggle = !state.persistFormData;
    dispatch({ type: "setPersistFormData", payload: toggle });

    const persistFormData = localStorage.getItem("persistFormData");
    if (persistFormData === null)
      localStorage.setItem("persistFormData", JSON.stringify(toggle));
    else {
      localStorage.removeItem("persistFormData");
      localStorage.setItem("persistFormData", JSON.stringify(toggle));
    }
  };

  return (
    <Box
      sx={{
        marginBottom: "1rem",
      }}
    >
      <Paper elevation={2} variant="elevation">
        <Box
          sx={{
            padding: "1rem",
          }}
        >
          <FormControlLabel
            sx={{
              margin: "0",
            }}
            control={
              <Switch
                checked={!!state.persistFormData}
                size="medium"
                color={"secondary"}
                onChange={handleTogglePersistFormData}
              />
            }
            label="Persits Form Data"
          />
          <TextField
            name="description"
            type="text"
            placeholder="Description"
            fullWidth
            onChange={(e) =>
              dispatch({ type: "setDescription", payload: e.target.value })
            }
            error={state.isDescriptionError}
            value={state.description}
            helperText={state.isDescriptionError && state.descriptionHelperText}
            sx={{
              padding: "0.5rem",
            }}
          />
          <TextField
            name="amount"
            type="text"
            placeholder="Amount"
            fullWidth
            onChange={(e) =>
              dispatch({ type: "setAmount", payload: e.target.value })
            }
            error={state.isAmountError}
            value={state.amount}
            helperText={state.isAmountError && state.amountHelperText}
            sx={{
              padding: "0.5rem",
            }}
          />
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={handleFormSubmit}
            sx={{
              margin: "0.5rem",
            }}
          >
            Register {transactionType.toString().toUpperCase()}
          </Button>
          <Button
            type="reset"
            color="secondary"
            variant="outlined"
            className="transaction-reset-button"
            onClick={() => dispatch({ type: "reset" })}
          >
            Reset
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TransactionForm;
