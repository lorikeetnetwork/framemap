import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCanvasTheme } from "@/contexts/CanvasThemeContext";
import { cn } from "@/lib/utils";

const ThemeSelector = () => {
  const { theme, setThemeId, themes, coloredBranches, setColoredBranches } =
    useCanvasTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Theme">
          <Palette className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="space-y-4">
          <div className="font-medium text-sm">Canvas Theme</div>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setThemeId(t.id)}
                className={cn(
                  "relative h-10 w-full rounded border-2 transition-all",
                  theme.id === t.id
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-transparent hover:border-muted-foreground/30"
                )}
                style={{ backgroundColor: t.colors.background }}
                title={t.name}
              >
                <div
                  className="absolute inset-1 rounded-sm"
                  style={{
                    backgroundColor: t.colors.nodeBackground,
                    border: `1px solid ${t.colors.nodeBorder}`,
                  }}
                />
                {theme.id === t.id && (
                  <Check className="absolute inset-0 m-auto w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">{theme.name}</div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="colored-branches" className="text-sm">
                Colored Branches
              </Label>
              <Switch
                id="colored-branches"
                checked={coloredBranches}
                onCheckedChange={setColoredBranches}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Apply different colors to each branch level
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeSelector;
