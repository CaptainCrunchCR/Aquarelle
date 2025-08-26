"use client";

import TransactionFormState from "@/interfaces/states/transaction-form-state.interface";
import TransactionFormProps from "@/interfaces/properties/transaction-form-props.interface";
import { TransactionFormAction, Transaction } from "@/types/transaction.types";
import TransactionFormSchema from "@/schemas/transaction-form.schema";

import React, { FC, useReducer, useEffect, useState, useCallback } from "react";
import * as zod from "zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { capitalizeString } from "@/services/formattingService";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { TransactionType, TRANSACTION_TYPES } from "@/types/transaction.types";

import toast from "react-hot-toast";

const TransactionForm: FC<TransactionFormProps> = ({ transactionHook }) => {
  /**
   * This state prevents hydration errors, is only used as a security method to prevent NextJS issues.
   */
  const [isClient, setIsClient] = useState<boolean>(false);

  const { addNewTransaction } = transactionHook;
  const persistFormOptionName = "persistFormData";

  const getPersistFormOptionFromLocalStorage = useCallback(() => {
    let persistFormOption;
    try {
      persistFormOption = JSON.parse(
        localStorage.getItem(persistFormOptionName) ?? ""
      );
    } catch {
      persistFormOption = null;
    }
    return persistFormOption;
  }, [persistFormOptionName]);

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
          transactionType: TRANSACTION_TYPES.EXPENSE,
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
      case "setTransactionType":
        return {
          ...state,
          transactionType: action.payload,
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
    persistFormData: false,
    transactionType: TRANSACTION_TYPES.EXPENSE,
  });

  /**
   * Syncs default state with local storage object in the first render.
   */
  useEffect(() => {
    setIsClient(true);

    const persistFormOption = getPersistFormOptionFromLocalStorage();

    if (persistFormOption !== null)
      dispatch({ type: "setPersistFormData", payload: persistFormOption });
  }, [getPersistFormOptionFromLocalStorage]);

  /**
   * Syncs local storage object with the state when state.persistFormData is changed or in the first render.
   */
  useEffect(() => {
    if (!isClient) return;

    const persistFormOption = getPersistFormOptionFromLocalStorage();
    /**
     * The local storage doesn't have a stored value
     */
    if (persistFormOption === null) {
      localStorage.setItem(persistFormOptionName, JSON.stringify(false));
    } else if (persistFormOption !== state.persistFormData) {
      /**
       * Only happens when the reducer was dispatched, so localStorage needs to be synced
       */
      localStorage.removeItem(persistFormOptionName);
      localStorage.setItem(
        persistFormOptionName,
        JSON.stringify(state.persistFormData)
      );
    } else return;
  }, [
    isClient,
    state.persistFormData,
    getPersistFormOptionFromLocalStorage,
    persistFormOptionName,
  ]);

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

      if (transactions.length > 0) {
        const currentStateStored = transactions.find(
          (e) =>
            e.amount === state.amount &&
            e.description === state.description &&
            e.type === e.type
        );
        if (currentStateStored) {
          toast.error(
            `🙅‍♂️ ${
              state.description
            } was already added to your ${capitalizeString(
              state.transactionType
            )}s!`,
            {
              position: "bottom-left",
              duration: 5000,
            }
          );
          return;
        }
      }

      addNewTransaction({
        description: state.description,
        amount: state.amount,
        type: state.transactionType,
      } as Transaction);

      toast.success(
        `🎉 ${state.description} added to your ${state.transactionType}s!`,
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
    const persistFormOption = getPersistFormOptionFromLocalStorage();
    if (persistFormOption === null) {
      dispatch({ type: "setPersistFormData", payload: false });
    } else {
      dispatch({
        type: "setPersistFormData",
        payload: !persistFormOption as boolean,
      });
    }
  };

  return (
    <Box>
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
                color="primary"
                onChange={handleTogglePersistFormData}
              />
            }
            label="Persits Form Data"
          />
          <Box>
            <FormControl sx={{ width: 120, m: "0.5rem" }} size="small">
              <InputLabel id="transaction-type">Type</InputLabel>
              <Select
                labelId="transaction-type"
                label="Type"
                value={state.transactionType}
                onChange={(e) =>
                  dispatch({
                    type: "setTransactionType",
                    payload: e.target.value as TransactionType,
                  })
                }
              >
                <MenuItem value="income" selected>
                  Income
                </MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
          </Box>
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
            color="primary"
            variant="contained"
            onClick={handleFormSubmit}
            sx={{
              margin: "0.5rem",
            }}
          >
            Register {state.transactionType}
          </Button>
          <Button
            type="reset"
            color="primary"
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
