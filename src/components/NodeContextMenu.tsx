import { Edit2, Plus, Trash2, Palette, FolderPlus, Settings2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FrameworkNode } from "@/types/framework";

interface NodeContextMenuProps {
  children: React.ReactNode;
  node: FrameworkNode;
  onEdit: () => void;
  onEditProperties?: () => void;
  onAddChild: () => void;
  onAddSibling: () => void;
  onDelete: () => void;
  onSetColor: (color: string | undefined) => void;
}

const colorOptions = [
  { label: "Default", value: undefined },
  { label: "Green", value: "160 100% 45%" },
  { label: "Blue", value: "200 100% 50%" },
  { label: "Purple", value: "270 100% 60%" },
  { label: "Orange", value: "30 100% 50%" },
  { label: "Red", value: "0 100% 50%" },
  { label: "Yellow", value: "50 100% 50%" },
];

const NodeContextMenu = ({
  children,
  node,
  onEdit,
  onEditProperties,
  onAddChild,
  onAddSibling,
  onDelete,
  onSetColor,
}: NodeContextMenuProps) => {
  const hasChildren = node.children && node.children.length > 0;
  const isFolder = node.type === "folder" || hasChildren;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onEdit} className="gap-2">
          <Edit2 className="h-4 w-4" />
          Edit Name
        </ContextMenuItem>

        {onEditProperties && (
          <ContextMenuItem onClick={onEditProperties} className="gap-2">
            <Settings2 className="h-4 w-4" />
            Edit Properties
          </ContextMenuItem>
        )}

        {isFolder && (
          <ContextMenuItem onClick={onAddChild} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Child
          </ContextMenuItem>
        )}

        <ContextMenuItem onClick={onAddSibling} className="gap-2">
          <FolderPlus className="h-4 w-4" />
          Add Sibling
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger className="gap-2">
            <Palette className="h-4 w-4" />
            Set Color
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {colorOptions.map((option) => (
              <ContextMenuItem
                key={option.label}
                onClick={() => onSetColor(option.value)}
                className="gap-2"
              >
                {option.value ? (
                  <div
                    className="h-4 w-4 rounded-full border border-border"
                    style={{ backgroundColor: `hsl(${option.value})` }}
                  />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-border bg-muted" />
                )}
                {option.label}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={onDelete}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Delete{hasChildren ? " (with children)" : ""}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default NodeContextMenu;
