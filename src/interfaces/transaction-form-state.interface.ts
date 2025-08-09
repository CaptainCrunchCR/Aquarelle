interface TransactionFormState {
  description: string;
  amount: string;
  isDescriptionError: boolean;
  isAmountError: boolean;
  descriptionHelperText?: string;
  amountHelperText?: string;
  persistFormData?: boolean;
}

export default TransactionFormState;
