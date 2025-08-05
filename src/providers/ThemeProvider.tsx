import React, {
  createContext,
  useContext,
  // useState,  // Temporairement non utilisé
  // useEffect, // Temporairement non utilisé
  ReactNode,
} from "react";
// import { Appearance, ColorSchemeName } from "react-native"; // Temporairement non utilisé
import { lightTheme, darkTheme, ThemeColors } from "../utils/colors";

interface ThemeContextType {
  theme: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // TEMPORAIREMENT DÉSACTIVÉ : Mode sombre
  // Toujours utiliser le thème clair pour éviter les problèmes de rendu
  
  // const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
  //   Appearance.getColorScheme()
  // );

  // useEffect(() => {
  //   const subscription = Appearance.addChangeListener(({ colorScheme }) => {
  //     setColorScheme(colorScheme);
  //   });

  //   return () => subscription?.remove?.();
  // }, []);

  // const isDark = colorScheme === "dark";
  // const theme = isDark ? darkTheme : lightTheme;

  // FORCER LE MODE CLAIR TEMPORAIREMENT
  const isDark = false;
  const theme = lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé dans le ThemeProvider");
  }
  return context;
};
