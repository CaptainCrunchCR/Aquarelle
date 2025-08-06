"use client";
import "./ExpenseForm.css";

import ExpenseFormState from "@/interfaces/expense-form-state.interface";
import {
  ExpenseFormAction,
  ExpenseForm as ExpenseFormType,
} from "@/types/expense-form.types";
import ExpenseFormSchema from "@/schemas/expense-form.schema";
import React, { useReducer } from "react";
import * as zod from "zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import toast from "react-hot-toast";

const ExpenseForm = () => {
  const expenseReducer = (
    state: ExpenseFormState,
    action: ExpenseFormAction
  ): ExpenseFormState => {
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

  const [state, dispatch] = useReducer(expenseReducer, {
    amount: "",
    description: "",
    isDescriptionError: false,
    isAmountError: false,
    persistFormData: true,
  });

  const handleFormValidation = () => {
    try {
      ExpenseFormSchema.parse(state);
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
      const expenses = JSON.parse(
        localStorage.getItem("expenses") ?? "[]"
      ) as Array<ExpenseFormType>;
      if (expenses.length === 0) {
        addNewExpenseToLocalStorage();
      } else {
        const currentStateStored = expenses.find(
          (e) =>
            e.amount === state.amount && e.description === state.description
        );
        if (currentStateStored) {
          toast.error(
            `🙅‍♂️ ${state.description} was already added to your expenses!`,
            {
              position: "bottom-left",
              duration: 5000,
            }
          );
          return;
        }
        addNewExpenseToLocalStorage();
      }

      toast.success(`🎉 ${state.description} added!`, {
        position: "bottom-left",
        duration: 5000,
      });

      if (!state.persistFormData) dispatch({ type: "reset" });
    } catch {
      return;
    }
  };

  const handleTogglePersistFormData = () => {
    const toggle = !state.persistFormData;
    dispatch({ type: "setPersistFormData", payload: toggle });

    const persistFormData = localStorage.getItem("persistFormData");
    if (persistFormData === null)
      localStorage.setItem("persistFormData", JSON.stringify(toggle));
    else {
      localStorage.removeItem("persistFormData");
      localStorage.setItem("persistFormData", JSON.stringify(toggle));
    }

    toast.success(`🔔 Persist Form Data now is ${toggle ? "ON" : "OFF"}`, {
      position: "bottom-left",
      duration: 5000,
    });
  };

  const addNewExpenseToLocalStorage = () => {
    const expenses = JSON.parse(
      localStorage.getItem("expenses") ?? "[]"
    ) as Array<ExpenseFormType>;
    const newExpense: ExpenseFormType = {
      description: state.description,
      amount: state.amount,
    };
    expenses.push(newExpense);
    localStorage.removeItem("expenses");
    localStorage.setItem("expenses", JSON.stringify(expenses));
    console.info("Registered to local storage...");
  };
  return (
    <Box className="expense">
      <FormControlLabel
        className="expense-item"
        id="expense-persist-form-control"
        control={
          <Switch
            defaultChecked
            size="medium"
            value={state.persistFormData}
            color="secondary"
            onChange={handleTogglePersistFormData}
          />
        }
        label="Persits Form Data"
      />
      <TextField
        name="description"
        type="text"
        placeholder="Description"
        className="expense-item"
        fullWidth
        onChange={(e) =>
          dispatch({ type: "setDescription", payload: e.target.value })
        }
        error={state.isDescriptionError}
        value={state.description}
        helperText={state.isDescriptionError && state.descriptionHelperText}
      />
      <TextField
        name="amount"
        type="text"
        placeholder="Amount"
        className="expense-item"
        fullWidth
        onChange={(e) =>
          dispatch({ type: "setAmount", payload: e.target.value })
        }
        error={state.isAmountError}
        value={state.amount}
        helperText={state.isAmountError && state.amountHelperText}
      />
      <Button
        type="submit"
        color="success"
        variant="contained"
        className="expense-register-button"
        onClick={handleFormSubmit}
      >
        Register Expense
      </Button>
      <Button
        type="reset"
        color="warning"
        variant="contained"
        className="expense-reset-button"
        onClick={() => dispatch({ type: "reset" })}
      >
        Reset
      </Button>
    </Box>
  );
};

export default ExpenseForm;
