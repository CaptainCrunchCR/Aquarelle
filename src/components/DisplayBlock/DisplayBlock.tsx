"use client";
import DisplayBlockProps from "@/interfaces/display-block-props.interface";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const DisplayBlock: React.FC<DisplayBlockProps> = ({
  title,
  description,
  className,
}) => {
  const classNames = `${className}`;
  return (
    <>
      <Card
        elevation={5}
        variant="elevation"
        className={classNames}
        sx={{
          width: "fit-content",
          height: 150,
          backgroundColor: "secondary.main",
          position: "relative",
          overflow: "visible",
          "& .MuiCardContent-root": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          },
          "& .MuiTypography-root:nth-child(1)": {
            color: "secondary.contrastText",
          },
          "& .MuiTypography-root:nth-child(2)": {
            color: "secondary.contrastText",
            opacity: 0.8,
          },
        }}
      >
        <CardContent sx={{ height: "100%" }}>
          <Typography
            variant="h4"
            component="div"
            sx={{ fontFamily: "var(--font-poppins)" }}
            fontWeight={"bolder"}
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontFamily: "var(--font-poppins)" }}
            fontWeight={"bolder"}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default DisplayBlock;
