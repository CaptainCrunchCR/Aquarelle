"use client";
import "./ExpenseForm.module.css";

import ExpenseFormState from "@/interfaces/expense-form.interface";
import ExpenseFormAction from "@/types/expense-form.types";

import React, { useReducer } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

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
          descriptionError: "",
          amountError: "",
        };
      case "setDescriptionError":
        return {
          ...state,
          descriptionError: action.payload,
        };
      case "setAmountError":
        return {
          ...state,
          amountError: action.payload,
        };
      case "clearErrors":
        return {
          ...state,
          descriptionError: "",
          amountError: "",
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(expenseReducer, {
    amount: "",
    description: "",
    descriptionError: "",
    amountError: "",
  });

  const handleFormValidation = () => {
    console.log("Validating form...");
  };

  return (
    <Box className="expense">
      <TextField
        name="description"
        type="text"
        placeholder="Description"
        className="expense-item"
        fullWidth
        onChange={(e) =>
          dispatch({ type: "setDescription", payload: e.target.value })
        }
        value={state.description}
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
        value={state.amount}
      />
      <Button
        type="submit"
        color="success"
        variant="contained"
        className="expense-register-button"
        onClick={handleFormValidation}
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
      <Typography variant="body2">Description: {state.description}</Typography>
      <Typography variant="body2">
        Description Error: {state.descriptionError}
      </Typography>
      <Typography variant="body2">Expense: {state.amount}</Typography>
      <Typography variant="body2">
        Expense Error: {state.amountError}
      </Typography>
    </Box>
  );
};

export default ExpenseForm;