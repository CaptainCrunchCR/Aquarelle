"use client";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import NavigationItem from "@/components/navigation/NavigationItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import navigationData from "@/navigation.json";
import { styled } from "@mui/material/styles";

const drawerWidth = "240px";
export default function NavigationBar() {
  const [open, setIsOpen] = useState<boolean>(false);

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={[
          open && {
            position: "fixed",
            width: `calc(100% - ${drawerWidth})`,
            marginLeft: drawerWidth,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          },
        ]}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setIsOpen(!open)}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              textTransform: "uppercase",
              fontFamily: "var(--font-poppins)",
              fontWeight: "bolder",
            }}
          >
            Aquarelle
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={open} variant="temporary" onClose={() => setIsOpen(false)}>
        <DrawerHeader>
          <IconButton color="secondary" onClick={() => setIsOpen(!open)}>
            <ChevronLeftRounded />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box width={drawerWidth}>
          <List>
            {navigationData.map((item, index) => (
              <NavigationItem navigationItem={item} key={item.name + index} />
            ))}
            <Divider />
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
