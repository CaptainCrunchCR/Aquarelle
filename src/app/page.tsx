import ExpenseForm from "@/components/forms/ExpenseForm/ExpenseForm";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";

export default function Home() {
  return (
    <>
      <Container maxWidth="xl">
        <Paper elevation={2}>
          <ExpenseForm />
        </Paper>
      </Container>      
    </>
  );
}
