import ExpenseForm from "@/components/forms/ExpenseForm/ExpenseForm";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <>
      <Container maxWidth="xl" sx={{ marginY: "2rem" }}>
        <Paper elevation={2}>
          <ExpenseForm />
          <Toaster />
        </Paper>
      </Container>
    </>
  );
}
