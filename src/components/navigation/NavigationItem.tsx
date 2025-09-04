"use client";
import React, { FC } from "react";
import Link from "next/link";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NavigationItemProps from "@/interfaces/properties/navigation-item-props.interface";
import PointOfSaleRoundedIcon from "@mui/icons-material/PointOfSaleRounded";

const NavigationItem: FC<NavigationItemProps> = ({
  navigationItem: { name, route, icon },
}) => {
  const iconMapper = {
    "point-of-sale-rounded-icon": PointOfSaleRoundedIcon,
  };

  const IconComponent =
    icon != undefined ? iconMapper[icon as keyof typeof iconMapper] : "";

  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} href={route}>
        <ListItemIcon>{IconComponent && <IconComponent />}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  );
};

export default NavigationItem;
