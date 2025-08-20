"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import DisplayBlockProps from "@/interfaces/display-block-props.interface";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const DisplayBlock: React.FC<DisplayBlockProps> = ({ title, description }) => {
  return (
    <Card
      variant="elevation"
      elevation={3}
      sx={{
        minHeight: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "1rem",
        borderRadius: "25px",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Paper
          variant="elevation"
          elevation={3}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 60,
            minHeight: 60,
            borderRadius: "100%",
            backgroundColor: "primary.50",
          }}
        >
          <DonutSmallRoundedIcon fontSize="large" color="primary" />
        </Paper>
        <Typography
          variant="h5"
          component="div"
          fontWeight="300"
          color="textPrimary"
        >
          {title}
        </Typography>
        <Chip
          label={
            <Typography
              variant="body1"
              component="div"
              fontWeight="400"
              fontFamily="var(--font-jetbrains-mono)"
              color="primary.dark"
            >
              {description}
            </Typography>
          }
          variant="outlined"
          sx={{
            color: "primary.dark",
            backgroundColor: "primary.50",
          }}
        />
      </CardContent>
    </Card>
  );
};

export default DisplayBlock;
