"use client";

import * as zod from "zod";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { Category, CategoryOptionType } from "@/types/category.types";
import React, { FC, useCallback, useEffect, useReducer, useState } from "react";
import {
  TRANSACTION_TYPES,
  Transaction,
  TransactionType,
} from "@/types/transaction.types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { TransactionFormAction } from "@/types/transaction.types";
import TransactionFormProps from "@/interfaces/properties/transaction-form-props.interface";
import TransactionFormSchema from "@/schemas/transaction-form.schema";
import TransactionFormState from "@/interfaces/states/transaction-form-state.interface";
import { capitalizeString } from "@/services/formattingService";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const filter = createFilterOptions<CategoryOptionType>();
const TransactionForm: FC<TransactionFormProps> = ({ transactionHook }) => {
  const formCategoryOptions: CategoryOptionType[] =
    transactionHook.state.categories.map((cat) => ({ name: cat.name }));
  /**
   * This state prevents hydration errors, is only used as a security method to prevent NextJS issues.
   */
  const [isClient, setIsClient] = useState<boolean>(false);

  const {
    addNewTransaction,
    addNewCategory,
    state: { transactions, categories },
  } = transactionHook;
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
          persistFormData: !!state.persistFormData,
          transactionType: TRANSACTION_TYPES.EXPENSE,
          transactionCategory: { name: categories[0].name },
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
      case "setTransactionCategory":
        return {
          ...state,
          transactionCategory: action.payload,
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
    transactionCategory: { name: categories[0].name },
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

      const { name, inputValue } = state.transactionCategory;
      let assignedName = "";
      if (name && (!inputValue || inputValue.length === 0)) {
        assignedName = name;
      } else {
        if (inputValue) {
          assignedName = inputValue;
        }
      }
      const mappedCategory = {
        name: assignedName,
      } as Category;

      const transaction = {
        id: uuidv4(),
        description: state.description,
        amount: state.amount,
        type: state.transactionType,
        created_at: new Date(),
      } as Transaction;

      const isExistent = categories.find((cat) => cat.name === assignedName);

      if (isExistent) {
        transaction.categoryId = isExistent.id;
      } else {
        mappedCategory.id = uuidv4();
        transaction.categoryId = mappedCategory.id;
        addNewCategory(mappedCategory);
      }

      addNewTransaction(transaction);
      toast.success(
        `🎉 ${state.description} added to your ${state.transactionType}s!`,
        {
          position: "bottom-left",
          duration: 5000,
        }
      );

      if (!state.persistFormData) dispatch({ type: "reset" });
    } catch (error) {
      toast.error("An error occurred while trying to add the transaction.", {
        position: "bottom-left",
        duration: 5000,
      });

      console.error(
        `An error occurred while trying to add the transaction: ${error}`
      );
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
          <Box sx={{ display: "flex" }}>
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
            {state.transactionType === TRANSACTION_TYPES.EXPENSE && (
              <Autocomplete
                sx={{ minWidth: 120, maxWidth: 200, m: "0.5rem", flexGrow: 1 }}
                selectOnFocus
                clearOnBlur
                options={formCategoryOptions}
                value={state.transactionCategory}
                handleHomeEndKeys
                freeSolo
                size="small"
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some(
                    (option) => inputValue === option.name
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      inputValue: inputValue,
                      name: `Add ${inputValue}`,
                    });
                  }
                  return filtered;
                }}
                onChange={(_, newValue) => {
                  if (typeof newValue === "string") {
                    dispatch({
                      type: "setTransactionCategory",
                      payload: { name: newValue },
                    });
                  } else if (newValue && newValue.inputValue) {
                    dispatch({
                      type: "setTransactionCategory",
                      payload: { name: newValue.inputValue },
                    });
                  } else {
                    dispatch({
                      type: "setTransactionCategory",
                      payload: newValue as Category,
                    });
                  }
                }}
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  return option.name;
                }}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li key={key} {...optionProps}>
                      {option.name}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    size="small"
                    sx={{
                      ".MuiAutocomplete-endAdornment": {
                        display: "none",
                      },
                    }}
                  />
                )}
              />
            )}
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
            helperText={
              state.isDescriptionError ? state.descriptionHelperText : null
            }
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
            helperText={state.isAmountError ? state.amountHelperText : null}
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
