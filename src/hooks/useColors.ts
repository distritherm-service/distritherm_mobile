import { useTheme } from "../providers/ThemeProvider";
import { ThemeColors } from "../utils/colors";

export const useColors = (): ThemeColors => {
  const { theme } = useTheme();
  return theme;
};
