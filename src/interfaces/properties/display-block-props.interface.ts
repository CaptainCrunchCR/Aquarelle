import {
  DisplayBlockColors,
  DisplayBlockVariant,
} from "@/types/display-block.types";
import type { SvgIconProps } from "@mui/material/SvgIcon";
interface DisplayBlockProps {
  variant?: DisplayBlockVariant;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ElementType<SvgIconProps>;
  color?: DisplayBlockColors;
}

export default DisplayBlockProps;
