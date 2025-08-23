import type { SvgIconProps } from "@mui/material/SvgIcon";
import {
  DisplayBlockColors,
  DisplayBlockVariant,
} from "@/types/display-block.types";
interface DisplayBlockProps {
  variant?: DisplayBlockVariant;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ElementType<SvgIconProps>;
  color?: DisplayBlockColors;
}

export default DisplayBlockProps;
