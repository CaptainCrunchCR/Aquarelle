"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import DisplayBlockProps from "@/interfaces/display-block-props.interface";
import Paper from "@mui/material/Paper";
import { red, green } from "@mui/material/colors";
import Typography from "@mui/material/Typography";

const DisplayBlock: React.FC<DisplayBlockProps> = ({
  color = "primary",
  variant = "default",
  title,
  description,
  icon: DisplayBlockIcon,
}) => {
  const variantStyles = {
    compact: {
      card: {
        padding: "0.2rem",
      },
      cardContent: {
        gap: 1.5,
      },
    },
    default: {
      card: {
        padding: "0.5rem",
      },
      cardContent: {
        gap: 2,
      },
    },
  };

  const colorMapping = {
    "error.50": red[50],
    "error.dark": red[900],
    "success.50": green[50],
    "success.dark": green[900],
    "primary.50": "primary.50",
    "primary.dark": "primary.dark",
    "secondary.50": "secondary.50",
    "secondary.dark": "secondary.dark",
  };

  const colorStyles = {
    paper: { backgroundColor: colorMapping[`${color}.50`] },
    description: {
      descriptionTypography: { color: colorMapping[`${color}.dark`] },
      descriptionChip: {
        color: colorMapping[`${color}.dark`],
        backgroundColor: colorMapping[`${color}.50`],
      },
    },
    displayBlockIcon: {
      color: colorMapping[`${color}.dark`],
    },
  };
  return (
    <Card
      variant="elevation"
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        ...variantStyles[variant].card,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ...variantStyles[variant].cardContent,
        }}
      >
        {DisplayBlockIcon && (
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
              ...colorStyles.paper,
            }}
          >
            <DisplayBlockIcon sx={{ ...colorStyles.displayBlockIcon }} />
          </Paper>
        )}
        {title && (
          <Typography
            variant="h5"
            component="div"
            fontWeight="300"
            color="textPrimary"
          >
            {title}
          </Typography>
        )}
        {description && (
          <Chip
            label={
              <Typography
                variant="body1"
                component="div"
                fontWeight="400"
                fontFamily="var(--font-jetbrains-mono)"
                sx={{
                  ...colorStyles.description.descriptionTypography,
                }}
              >
                {description}
              </Typography>
            }
            variant="outlined"
            sx={{ ...colorStyles.description.descriptionChip }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DisplayBlock;
