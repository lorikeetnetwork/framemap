import { createContext, useContext, useState, ReactNode } from "react";
import { CanvasTheme, canvasThemes, getThemeById } from "@/data/canvasThemes";
import { LayoutType } from "@/lib/canvasLayouts";

interface CanvasThemeContextType {
  theme: CanvasTheme;
  setThemeId: (id: string) => void;
  coloredBranches: boolean;
  setColoredBranches: (enabled: boolean) => void;
  layoutType: LayoutType;
  setLayoutType: (type: LayoutType) => void;
  themes: CanvasTheme[];
}

const CanvasThemeContext = createContext<CanvasThemeContextType | null>(null);

interface CanvasThemeProviderProps {
  children: ReactNode;
  initialThemeId?: string;
  initialLayoutType?: LayoutType;
  initialColoredBranches?: boolean;
  onSettingsChange?: (settings: {
    themeId: string;
    layoutType: LayoutType;
    coloredBranches: boolean;
  }) => void;
}

export function CanvasThemeProvider({
  children,
  initialThemeId = "default",
  initialLayoutType = "tree",
  initialColoredBranches = false,
  onSettingsChange,
}: CanvasThemeProviderProps) {
  const [themeId, setThemeIdState] = useState(initialThemeId);
  const [coloredBranches, setColoredBranchesState] = useState(initialColoredBranches);
  const [layoutType, setLayoutTypeState] = useState<LayoutType>(initialLayoutType);

  const theme = getThemeById(themeId);

  const setThemeId = (id: string) => {
    setThemeIdState(id);
    onSettingsChange?.({ themeId: id, layoutType, coloredBranches });
  };

  const setColoredBranches = (enabled: boolean) => {
    setColoredBranchesState(enabled);
    onSettingsChange?.({ themeId, layoutType, coloredBranches: enabled });
  };

  const setLayoutType = (type: LayoutType) => {
    setLayoutTypeState(type);
    onSettingsChange?.({ themeId, layoutType: type, coloredBranches });
  };

  return (
    <CanvasThemeContext.Provider
      value={{
        theme,
        setThemeId,
        coloredBranches,
        setColoredBranches,
        layoutType,
        setLayoutType,
        themes: canvasThemes,
      }}
    >
      {children}
    </CanvasThemeContext.Provider>
  );
}

export function useCanvasTheme() {
  const context = useContext(CanvasThemeContext);
  if (!context) {
    throw new Error("useCanvasTheme must be used within CanvasThemeProvider");
  }
  return context;
}
