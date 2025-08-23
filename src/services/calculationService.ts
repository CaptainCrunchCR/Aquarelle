import Big from "big.js";

/**
 * Returns the sum of a Big[] array
 * @param numbers - collection of Big numbers
 * @returns the sum of all the Big numbers
 */
const calculateTotalAdditionInAmount = (numbers: Array<Big>): Big => {
  return numbers.reduce((acc, expense) => acc.add(expense), Big("0"));
};

/**
 * Returns the substraction of a Big[] array
 * @param numbers - collection of Big numbers
 * @returns the substraction of all the Big numbers
 */
const calculateTotalSubstractionInAmount = (numbers: Array<Big>): Big => {
  return numbers.reduce((acc, expense) => acc.minus(expense), Big("0"));
};

/**
 * Performs the Net Worth formula: Total Incomes - Total Expenses
 * @param expenses - Incomes
 * @param incomes - Expenses Array
 * @returns Net Worth of type Big
 */
const calculateNetWorth = (expenses: Array<Big>, incomes: Array<Big>): Big => {
  const incomesTotal = calculateTotalAdditionInAmount(incomes);
  const expensesTotal = calculateTotalAdditionInAmount(expenses);
  return incomesTotal.minus(expensesTotal);
};

export {
  calculateTotalAdditionInAmount,
  calculateTotalSubstractionInAmount,
  calculateNetWorth,
};
