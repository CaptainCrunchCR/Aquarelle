type ExpenseFormAction =
  | { type: "setAmount"; payload: string }
  | { type: "setDescription"; payload: string }
  | { type: "reset" }
  | { type: "setAmountError"; payload: string }
  | { type: "setDescriptionError"; payload: string }
  | { type: "clearErrors" };

export default ExpenseFormAction;
