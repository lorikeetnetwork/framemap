import { useState } from "react";
import {
  ChevronRight,
  ExternalLink,
  Folder,
  FileText,
  CheckSquare,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TreeNodeProps, FrameworkNode } from "@/types/framework";
import EditableNodeLabel from "./EditableNodeLabel";
import NodeContextMenu from "./NodeContextMenu";
import AddNodeDialog from "./AddNodeDialog";
import { Button } from "@/components/ui/button";

const TreeNode = ({
  node,
  level,
  searchTerm,
  expandedNodes,
  toggleNode,
  nodePath,
  isLast,
  matchedPaths,
  onUpdateNode,
  onAddChild,
  onDeleteNode,
  selectedNodePath,
  onSelectNode,
}: TreeNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(nodePath);
  const isLink = !!node.url;
  const isMatched = matchedPaths.has(nodePath);
  const isHighlighted = searchTerm && node.name.toLowerCase().includes(searchTerm.toLowerCase());
  const isTask = node.type === "task";
  const isNote = node.type === "note";
  const isFolder = node.type === "folder" || hasChildren;
  const isEditable = !!onUpdateNode;
  const isSelected = selectedNodePath === nodePath;

  const nodeColor = node.color ? `hsl(${node.color})` : undefined;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectNode) {
      onSelectNode(isSelected ? null : nodePath);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) return;

    // If in selection mode (onSelectNode provided), handle selection
    if (onSelectNode) {
      handleSelect(e);
    }

    if (isLink && node.url) {
      window.open(node.url, "_blank", "noopener,noreferrer");
    } else if (hasChildren) {
      toggleNode(nodePath);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isEditable) return;
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveEdit = (newName: string) => {
    if (onUpdateNode) {
      onUpdateNode(nodePath, { name: newName });
    }
    setIsEditing(false);
  };

  const handleAddChild = (newNode: FrameworkNode) => {
    if (onAddChild) {
      onAddChild(nodePath, newNode);
      // Expand the node to show the new child
      if (!isExpanded) {
        toggleNode(nodePath);
      }
    }
    setShowAddDialog(false);
  };

  const handleDelete = () => {
    if (onDeleteNode) {
      onDeleteNode(nodePath);
    }
  };

  const handleSetColor = (color: string | undefined) => {
    if (onUpdateNode) {
      onUpdateNode(nodePath, { color });
    }
  };

  const handleToggleTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateNode && isTask) {
      onUpdateNode(nodePath, { completed: !node.completed });
    }
  };

  const getNodeIcon = () => {
    if (hasChildren) {
      return (
        <ChevronRight
          className={cn(
            "w-4 h-4 text-primary transition-transform duration-200",
            isExpanded && "rotate-90"
          )}
        />
      );
    }
    if (isTask) {
      return (
        <button onClick={handleToggleTask} className="flex items-center justify-center">
          <CheckSquare
            className={cn(
              "w-3 h-3 transition-colors",
              node.completed ? "text-primary" : "text-muted-foreground"
            )}
          />
        </button>
      );
    }
    if (isLink) {
      return <ExternalLink className="w-3 h-3 text-link" />;
    }
    if (isNote) {
      return <FileText className="w-3 h-3 text-muted-foreground" />;
    }
    return <FileText className="w-3 h-3 text-muted-foreground" />;
  };

  const nodeContent = (
    <div className="relative">
      {/* Horizontal connector line */}
      {level > 0 && (
        <div
          className="absolute left-0 top-[14px] w-4 h-px bg-tree-line"
          style={{ left: "-16px" }}
        />
      )}

      {/* Vertical connector line for siblings */}
      {level > 0 && !isLast && (
        <div
          className="absolute left-0 top-0 w-px bg-tree-line"
          style={{ left: "-16px", height: "100%" }}
        />
      )}

      {/* Vertical connector line up to this node */}
      {level > 0 && (
        <div
          className="absolute left-0 top-0 w-px bg-tree-line"
          style={{ left: "-16px", height: "14px" }}
        />
      )}

      {/* Node content */}
      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={cn(
          "group flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-all duration-200",
          "hover:bg-tree-node-hover",
          isSelected && "bg-primary/20 ring-1 ring-primary",
          isHighlighted && !isSelected && "bg-primary/20 ring-1 ring-primary/50",
          isMatched && !isHighlighted && !isSelected && "bg-secondary/50",
          isTask && node.completed && "opacity-60"
        )}
        style={nodeColor ? { borderLeft: `3px solid ${nodeColor}` } : undefined}
      >
        {/* Drag handle - only show in edit mode */}
        {isEditable && (
          <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-50 cursor-grab flex-shrink-0" />
        )}

        {/* Expand/collapse icon or node type icon */}
        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
          {getNodeIcon()}
        </span>

        {/* Folder icon for categories */}
        {hasChildren && (
          <Folder
            className={cn(
              "w-4 h-4 transition-colors duration-200 flex-shrink-0",
              isExpanded ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}
          />
        )}

        {/* Node label - editable or static */}
        {isEditing ? (
          <EditableNodeLabel
            value={node.name}
            isEditing={isEditing}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <span
            className={cn(
              "text-sm transition-colors duration-200",
              isLink
                ? "text-link hover:underline"
                : hasChildren
                ? isExpanded
                  ? "text-primary text-glow"
                  : "text-foreground group-hover:text-primary"
                : "text-muted-foreground",
              isHighlighted && "font-semibold text-primary",
              isTask && node.completed && "line-through"
            )}
          >
            {node.name}
          </span>
        )}

        {/* Item count badge for categories */}
        {hasChildren && !isEditable && (
          <span className="ml-auto text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {node.children?.length}
          </span>
        )}

        {/* Action buttons - only show in edit mode */}
        {isEditable && !isEditing && (
          <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isFolder && (
              <AddNodeDialog
                onAdd={handleAddChild}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                }
              />
            )}
            {level > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div
          className={cn(
            "ml-6 pl-4 border-l border-tree-line relative",
            "animate-fade-in"
          )}
        >
          {node.children?.map((child, index) => (
            <TreeNode
              key={`${nodePath}-${child.name}-${index}`}
              node={child}
              level={level + 1}
              searchTerm={searchTerm}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              nodePath={`${nodePath}/${child.name}`}
              isLast={index === (node.children?.length || 0) - 1}
              matchedPaths={matchedPaths}
              onUpdateNode={onUpdateNode}
              onAddChild={onAddChild}
              onDeleteNode={onDeleteNode}
              selectedNodePath={selectedNodePath}
              onSelectNode={onSelectNode}
            />
          ))}
        </div>
      )}
    </div>
  );

  // Wrap with context menu if editable
  if (isEditable) {
    return (
      <NodeContextMenu
        node={node}
        onEdit={() => setIsEditing(true)}
        onAddChild={() => setShowAddDialog(true)}
        onAddSibling={() => {
          // Will be handled by parent
        }}
        onDelete={handleDelete}
        onSetColor={handleSetColor}
      >
        {nodeContent}
      </NodeContextMenu>
    );
  }

  return nodeContent;
};

export default TreeNode;
