import { GitBranch, Network, Share2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCanvasTheme } from "@/contexts/CanvasThemeContext";
import { LayoutType } from "@/lib/canvasLayouts";
import { cn } from "@/lib/utils";

const layouts: { type: LayoutType; label: string; icon: typeof GitBranch }[] = [
  { type: "tree", label: "Tree", icon: GitBranch },
  { type: "org-chart", label: "Org Chart", icon: Network },
  { type: "mind-map", label: "Mind Map", icon: Share2 },
  { type: "radial", label: "Radial", icon: Circle },
];

interface LayoutSelectorProps {
  onLayoutChange?: () => void;
}

const LayoutSelector = ({ onLayoutChange }: LayoutSelectorProps) => {
  const { layoutType, setLayoutType } = useCanvasTheme();

  const currentLayout = layouts.find((l) => l.type === layoutType) || layouts[0];
  const Icon = currentLayout.icon;

  const handleSelect = (type: LayoutType) => {
    setLayoutType(type);
    onLayoutChange?.();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLayout.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {layouts.map((layout) => {
          const LayoutIcon = layout.icon;
          return (
            <DropdownMenuItem
              key={layout.type}
              onClick={() => handleSelect(layout.type)}
              className={cn(
                "gap-2",
                layoutType === layout.type && "bg-accent"
              )}
            >
              <LayoutIcon className="w-4 h-4" />
              {layout.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LayoutSelector;
