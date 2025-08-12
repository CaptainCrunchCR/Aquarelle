import Big from "big.js";

const calculateTotalAmount = (expenses: Array<Big>): Big => {
  return expenses.reduce((acc, expense) => acc.add(expense), Big("0"));
};

const parseFromStringCollectionToBig = (values: Array<string>): Big[] =>
  values.map((value) => Big(value));

export { calculateTotalAmount, parseFromStringCollectionToBig };
