import * as zod from "zod";

const TransactionFormSchema = zod.object({
  description: zod
    .string({ message: "Description value is required" })
    .min(2, { message: "Description should contain at least 2 letters" })
    .max(200, { message: "Description should be less than 200 letters" }),
  amount: zod
    .string({ message: "Amount is required" })
    .regex(/^(-?)(?!0\d)\d+(\.\d+)?$/, {
      message: "Amount should be a number",
    })
    .regex(/^(?!0\d)\d+(\.\d+)?$/, {
      message: "Amount should be a positive number",
    }),
});

export default TransactionFormSchema;
