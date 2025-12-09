import { memo } from "react";
import { Folder, Link, FileText, CheckSquare, GripVertical } from "lucide-react";
import { CanvasNode as CanvasNodeType } from "@/types/canvas";
import { cn } from "@/lib/utils";

interface CanvasNodeProps {
  node: CanvasNodeType;
  isSelected: boolean;
  zoom: number;
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onClick: (nodeId: string) => void;
}

const getNodeIcon = (type?: string) => {
  switch (type) {
    case "link":
      return Link;
    case "note":
      return FileText;
    case "task":
      return CheckSquare;
    default:
      return Folder;
  }
};

const CanvasNodeComponent = memo(({ node, isSelected, zoom, onMouseDown, onClick }: CanvasNodeProps) => {
  const Icon = getNodeIcon(node.node.type);
  const hasChildren = node.node.children && node.node.children.length > 0;

  return (
    <div
      className={cn(
        "absolute select-none cursor-grab active:cursor-grabbing",
        "bg-card border border-border rounded-none",
        "transition-shadow duration-200",
        isSelected && "ring-2 ring-primary shadow-lg",
        !isSelected && "hover:border-primary/50"
      )}
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
        minHeight: node.height,
        transform: `scale(${1})`,
      }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
      onClick={() => onClick(node.id)}
    >
      {/* Drag handle */}
      <div className="absolute -left-0.5 top-0 bottom-0 w-6 flex items-center justify-center text-muted-foreground/50 hover:text-muted-foreground cursor-grab">
        <GripVertical className="w-4 h-4" />
      </div>
      
      {/* Content */}
      <div className="p-3 pl-6">
        <div className="flex items-start gap-2">
          <Icon 
            className={cn(
              "w-4 h-4 mt-0.5 flex-shrink-0",
              node.node.type === "link" && "text-primary",
              node.node.type === "task" && node.node.completed && "text-primary",
              (!node.node.type || node.node.type === "folder") && "text-muted-foreground"
            )} 
          />
          <div className="flex-1 min-w-0">
            <h3 
              className={cn(
                "font-medium text-sm leading-tight truncate",
                node.node.type === "task" && node.node.completed && "line-through text-muted-foreground"
              )}
              style={{ color: node.node.color }}
            >
              {node.node.name}
            </h3>
            {node.node.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {node.node.description}
              </p>
            )}
            {hasChildren && (
              <p className="text-xs text-muted-foreground/70 mt-1">
                {node.node.children!.length} children
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Connection points */}
      <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-border border-2 border-background" />
      <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-border border-2 border-background" />
    </div>
  );
});

CanvasNodeComponent.displayName = "CanvasNode";

export default CanvasNodeComponent;
