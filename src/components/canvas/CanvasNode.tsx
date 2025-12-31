import { memo } from "react";
import {
  Folder,
  Link,
  FileText,
  CheckSquare,
  GripVertical,
  Layers,
  LayoutList,
  Image,
  Type,
} from "lucide-react";
import { CanvasNode as CanvasNodeType } from "@/types/canvas";
import { cn } from "@/lib/utils";
import LinkPreviewCard from "@/components/cards/LinkPreviewCard";
import ImageCard from "@/components/cards/ImageCard";
import TextCard from "@/components/cards/TextCard";
import { useCanvasTheme } from "@/contexts/CanvasThemeContext";

interface CanvasNodeProps {
  node: CanvasNodeType;
  isSelected: boolean;
  zoom: number;
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onClick: (nodeId: string) => void;
  isRelationshipMode?: boolean;
  isPendingRelationship?: boolean;
}

const getNodeIcon = (type?: string) => {
  switch (type) {
    case "topic":
      return Layers;
    case "subtopic":
      return LayoutList;
    case "link":
      return Link;
    case "note":
      return FileText;
    case "task":
      return CheckSquare;
    case "image":
      return Image;
    case "text":
      return Type;
    default:
      return Folder;
  }
};

const CanvasNodeComponent = memo(
  ({
    node,
    isSelected,
    zoom,
    onMouseDown,
    onClick,
    isRelationshipMode = false,
    isPendingRelationship = false,
  }: CanvasNodeProps) => {
    const { theme } = useCanvasTheme();
    const Icon = getNodeIcon(node.node.type);
    const hasChildren = node.node.children && node.node.children.length > 0;
    const isTopic = node.node.type === "topic";
    const isSubtopic = node.node.type === "subtopic";
    const isLink = node.node.type === "link";
    const isImage = node.node.type === "image";
    const isText = node.node.type === "text";

    // Dynamic width based on content
    const nodeWidth =
      isLink && node.node.linkPreview?.image ? 280 : node.width;

    return (
      <div
        className={cn(
          "absolute select-none",
          isRelationshipMode
            ? "cursor-crosshair"
            : "cursor-grab active:cursor-grabbing",
          "rounded-none transition-all duration-200",
          isSelected && "ring-2 ring-primary shadow-lg",
          isPendingRelationship && "ring-2 ring-primary/50 animate-pulse",
          !isSelected && !isPendingRelationship && "hover:shadow-md",
          isTopic && "border-l-2 border-l-primary",
          isSubtopic && "border-l-2 border-l-primary/50"
        )}
        style={{
          left: node.x,
          top: node.y,
          width: nodeWidth,
          minHeight: node.height,
          backgroundColor: theme.colors.nodeBackground,
          borderColor: theme.colors.nodeBorder,
          borderWidth: "1px",
          borderStyle: "solid",
          color: theme.colors.nodeText,
        }}
        onMouseDown={(e) => onMouseDown(e, node.id)}
        onClick={() => onClick(node.id)}
      >
        {/* Drag handle */}
        {!isRelationshipMode && (
          <div
            className="absolute -left-0.5 top-0 bottom-0 w-6 flex items-center justify-center opacity-50 hover:opacity-100 cursor-grab"
            style={{ color: theme.colors.nodeText }}
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        {/* Content */}
        <div className="p-3 pl-6">
          <div className="flex items-start gap-2">
            <Icon
              className={cn(
                "w-4 h-4 mt-0.5 flex-shrink-0",
                isTopic && "text-primary",
                isSubtopic && "text-primary/70",
                node.node.type === "link" && "text-primary",
                node.node.type === "task" &&
                  node.node.completed &&
                  "text-primary"
              )}
            />
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "leading-tight",
                  isTopic && "font-semibold text-base",
                  isSubtopic && "font-medium text-sm",
                  !isTopic && !isSubtopic && "font-medium text-sm truncate",
                  node.node.type === "task" &&
                    node.node.completed &&
                    "line-through opacity-60"
                )}
                style={{ color: node.node.color || theme.colors.nodeText }}
              >
                {node.node.name}
              </h3>

              {/* Description */}
              {node.node.description && (
                <p
                  className="text-xs mt-1 line-clamp-2 opacity-70"
                  style={{ color: theme.colors.nodeText }}
                >
                  {node.node.description}
                </p>
              )}

              {/* Link preview */}
              {isLink && node.node.url && (
                <div className="mt-2">
                  {node.node.linkPreview ? (
                    <LinkPreviewCard
                      url={node.node.url}
                      preview={node.node.linkPreview}
                      compact={!node.node.linkPreview.image}
                    />
                  ) : (
                    <LinkPreviewCard url={node.node.url} compact />
                  )}
                </div>
              )}

              {/* Image */}
              {isImage && node.node.imageData && (
                <div className="mt-2">
                  <ImageCard imageData={node.node.imageData} />
                </div>
              )}

              {/* Text content */}
              {isText && node.node.content && (
                <div className="mt-2">
                  <TextCard content={node.node.content} />
                </div>
              )}

              {/* Children count */}
              {hasChildren && (
                <p className="text-xs mt-1 opacity-50">
                  {node.node.children!.length} children
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Connection points */}
        <div
          className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
          style={{
            backgroundColor: theme.colors.nodeBorder,
            borderColor: theme.colors.nodeBackground,
          }}
        />
        <div
          className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
          style={{
            backgroundColor: theme.colors.nodeBorder,
            borderColor: theme.colors.nodeBackground,
          }}
        />
      </div>
    );
  }
);

CanvasNodeComponent.displayName = "CanvasNode";

export default CanvasNodeComponent;
