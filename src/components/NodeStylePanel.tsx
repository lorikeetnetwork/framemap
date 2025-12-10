import { useState } from "react";
import { 
  Palette, 
  Type, 
  Circle, 
  Square, 
  RectangleHorizontal,
  Bold,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FrameworkNode, NodeStyle } from "@/types/framework";
import { cn } from "@/lib/utils";

interface NodeStylePanelProps {
  node: FrameworkNode;
  onUpdateStyle: (style: Partial<NodeStyle>) => void;
  onClose?: () => void;
}

const FONT_FAMILIES = [
  { value: "default", label: "Default" },
  { value: "Inter", label: "Inter" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Fira Code", label: "Fira Code (Mono)" },
  { value: "Georgia", label: "Georgia (Serif)" },
];

const FONT_SIZES = [
  { value: "sm", label: "Small" },
  { value: "base", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "X-Large" },
];

const FONT_WEIGHTS = [
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semibold" },
  { value: "bold", label: "Bold" },
];

const NODE_SHAPES = [
  { value: "rectangle", label: "Rectangle", icon: Square },
  { value: "rounded", label: "Rounded", icon: RectangleHorizontal },
  { value: "pill", label: "Pill", icon: Circle },
];

const BORDER_STYLES = [
  { value: "none", label: "None" },
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
];

const PRESET_COLORS = [
  "0 0% 50%",      // Gray
  "0 72% 51%",     // Red
  "25 95% 53%",    // Orange
  "48 96% 53%",    // Yellow
  "142 71% 45%",   // Green
  "199 89% 48%",   // Blue
  "262 83% 58%",   // Purple
  "330 81% 60%",   // Pink
];

const NodeStylePanel = ({ node, onUpdateStyle, onClose }: NodeStylePanelProps) => {
  const style = node.style || {};

  return (
    <div className="bg-card border border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Node Style
        </h3>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Colors</Label>
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <div 
                  className="w-4 h-4 rounded border border-border"
                  style={{ backgroundColor: style.textColor ? `hsl(${style.textColor})` : 'currentColor' }}
                />
                Text
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="grid grid-cols-4 gap-1">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-6 h-6 rounded border border-border hover:scale-110 transition-transform",
                      style.textColor === color && "ring-2 ring-primary"
                    )}
                    style={{ backgroundColor: `hsl(${color})` }}
                    onClick={() => onUpdateStyle({ textColor: color })}
                  />
                ))}
                <button
                  className="w-6 h-6 rounded border border-border flex items-center justify-center text-xs"
                  onClick={() => onUpdateStyle({ textColor: undefined })}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <div 
                  className="w-4 h-4 rounded border border-border"
                  style={{ backgroundColor: style.backgroundColor ? `hsl(${style.backgroundColor})` : 'transparent' }}
                />
                Background
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="grid grid-cols-4 gap-1">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-6 h-6 rounded border border-border hover:scale-110 transition-transform",
                      style.backgroundColor === color && "ring-2 ring-primary"
                    )}
                    style={{ backgroundColor: `hsl(${color})` }}
                    onClick={() => onUpdateStyle({ backgroundColor: color })}
                  />
                ))}
                <button
                  className="w-6 h-6 rounded border border-border flex items-center justify-center text-xs"
                  onClick={() => onUpdateStyle({ backgroundColor: undefined })}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground flex items-center gap-1">
          <Type className="w-3 h-3" />
          Typography
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={style.fontFamily || "default"}
            onValueChange={(value) => onUpdateStyle({ fontFamily: value === "default" ? undefined : value })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={style.fontSize || "base"}
            onValueChange={(value) => onUpdateStyle({ fontSize: value as NodeStyle["fontSize"] })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select
          value={style.fontWeight || "normal"}
          onValueChange={(value) => onUpdateStyle({ fontWeight: value as NodeStyle["fontWeight"] })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Weight" />
          </SelectTrigger>
          <SelectContent>
            {FONT_WEIGHTS.map((weight) => (
              <SelectItem key={weight.value} value={weight.value}>
                <span className="flex items-center gap-2">
                  <Bold className="w-3 h-3" />
                  {weight.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Shape & Border */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Shape & Border</Label>
        <div className="flex gap-1">
          {NODE_SHAPES.map((shape) => {
            const Icon = shape.icon;
            return (
              <Button
                key={shape.value}
                variant={style.nodeShape === shape.value ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => onUpdateStyle({ nodeShape: shape.value as NodeStyle["nodeShape"] })}
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>

        <Select
          value={style.borderStyle || "none"}
          onValueChange={(value) => onUpdateStyle({ borderStyle: value as NodeStyle["borderStyle"] })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Border" />
          </SelectTrigger>
          <SelectContent>
            {BORDER_STYLES.map((border) => (
              <SelectItem key={border.value} value={border.value}>
                {border.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Custom Icon</Label>
        <Input
          placeholder="Lucide icon name (e.g., star)"
          value={style.icon || ""}
          onChange={(e) => onUpdateStyle({ icon: e.target.value || undefined })}
          className="h-8 text-xs"
        />
        <p className="text-xs text-muted-foreground">
          Leave empty for default icon based on node type
        </p>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onUpdateStyle({
          fontFamily: undefined,
          fontSize: undefined,
          fontWeight: undefined,
          textColor: undefined,
          backgroundColor: undefined,
          icon: undefined,
          borderStyle: undefined,
          nodeShape: undefined,
        })}
      >
        Reset to Default
      </Button>
    </div>
  );
};

export default NodeStylePanel;
