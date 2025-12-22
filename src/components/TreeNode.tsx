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
  Layers,
  LayoutList,
  Image,
  Type,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { TreeNodeProps, FrameworkNode } from "@/types/framework";
import EditableNodeLabel from "./EditableNodeLabel";
import NodeContextMenu from "./NodeContextMenu";
import AddNodeDialog from "./AddNodeDialog";
import { Button } from "@/components/ui/button";
import LinkPreviewCard from "./cards/LinkPreviewCard";
import ImageCard from "./cards/ImageCard";
import TextCard from "./cards/TextCard";

interface ExtendedTreeNodeProps extends TreeNodeProps {
  onOpenEditDialog?: (nodePath: string) => void;
}

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
  onAddSibling,
  onDeleteNode,
  selectedNodePath,
  onSelectNode,
  editingNodePath,
  onStartEdit,
  onOpenEditDialog,
}: ExtendedTreeNodeProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSiblingDialog, setShowSiblingDialog] = useState(false);

  // DnD setup
  const isRootNode = !nodePath.includes("/");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: nodePath,
    disabled: isRootNode, // Disable drag for root node
  });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(nodePath);
  const isLink = node.type === "link" || !!node.url;
  const isMatched = matchedPaths.has(nodePath);
  const isHighlighted = searchTerm && node.name.toLowerCase().includes(searchTerm.toLowerCase());
  const isTask = node.type === "task";
  const isNote = node.type === "note";
  const isTopic = node.type === "topic";
  const isSubtopic = node.type === "subtopic";
  const isImage = node.type === "image";
  const isText = node.type === "text";
  const isFolder = node.type === "folder" || (!node.type && hasChildren);
  const isContainer = isTopic || isSubtopic || isFolder || hasChildren;
  const isEditable = !!onUpdateNode;
  const isSelected = selectedNodePath === nodePath;
  const isEditing = editingNodePath === nodePath;

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
    if (onStartEdit) {
      onStartEdit(nodePath);
    }
  };

  const handleSaveEdit = (newName: string) => {
    if (onUpdateNode) {
      onUpdateNode(nodePath, { name: newName });
    }
    if (onStartEdit) {
      onStartEdit(null);
    }
  };

  const handleCancelEdit = () => {
    if (onStartEdit) {
      onStartEdit(null);
    }
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

  const handleAddSibling = (newNode: FrameworkNode) => {
    if (onAddSibling) {
      onAddSibling(nodePath, newNode);
    }
    setShowSiblingDialog(false);
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
    if (isTopic) {
      return <Layers className="w-3 h-3 text-primary" />;
    }
    if (isSubtopic) {
      return <LayoutList className="w-3 h-3 text-primary/70" />;
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
    if (isImage) {
      return <Image className="w-3 h-3 text-muted-foreground" />;
    }
    if (isText) {
      return <Type className="w-3 h-3 text-muted-foreground" />;
    }
    if (isNote) {
      return <FileText className="w-3 h-3 text-muted-foreground" />;
    }
    return <FileText className="w-3 h-3 text-muted-foreground" />;
  };

  const nodeContent = (
    <div 
      ref={setNodeRef} 
      style={sortableStyle} 
      className={cn("relative", isDragging && "z-50")}
    >
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
          "group flex items-start gap-2 py-1.5 px-2 rounded cursor-pointer transition-all duration-200",
          "hover:bg-tree-node-hover",
          isSelected && "bg-primary/20 ring-1 ring-primary",
          isHighlighted && !isSelected && "bg-primary/20 ring-1 ring-primary/50",
          isMatched && !isHighlighted && !isSelected && "bg-secondary/50",
          isTask && node.completed && "opacity-60",
          isTopic && "py-2",
          isSubtopic && "py-1.5"
        )}
        style={nodeColor ? { borderLeft: `3px solid ${nodeColor}` } : undefined}
      >
        {/* Drag handle - only show in edit mode */}
        {isEditable && !isRootNode && (
          <div 
            {...attributes} 
            {...listeners}
            className="flex items-center"
          >
            <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-50 cursor-grab flex-shrink-0 mt-0.5" />
          </div>
        )}

        {/* Expand/collapse icon or node type icon */}
        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5">
          {getNodeIcon()}
        </span>

        {/* Folder icon for containers */}
        {isContainer && !isTopic && !isSubtopic && (
          <Folder
            className={cn(
              "w-4 h-4 transition-colors duration-200 flex-shrink-0 mt-0.5",
              isExpanded ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}
          />
        )}

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {/* Node label - editable or static */}
          {isEditing ? (
            <EditableNodeLabel
              value={node.name}
              isEditing={isEditing}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <span
              className={cn(
                "transition-colors duration-200",
                isTopic && "text-base font-semibold text-foreground",
                isSubtopic && "text-sm font-medium text-foreground/90",
                isLink && "text-sm text-link hover:underline",
                isTask && "text-sm",
                isTask && node.completed && "line-through text-muted-foreground",
                !isTopic && !isSubtopic && !isLink && !isTask && "text-sm text-muted-foreground",
                isHighlighted && "font-semibold text-primary",
                isContainer && !isTopic && !isSubtopic && (isExpanded ? "text-primary text-glow" : "text-foreground group-hover:text-primary")
              )}
            >
              {node.name}
            </span>
          )}

          {/* Description for topic/subtopic/note */}
          {node.description && (isTopic || isSubtopic || isNote) && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {node.description}
            </p>
          )}

          {/* Link preview inline */}
          {isLink && node.url && node.linkPreview && (
            <div className="mt-2">
              <LinkPreviewCard url={node.url} preview={node.linkPreview} compact />
            </div>
          )}

          {/* Image inline */}
          {isImage && node.imageData && (
            <div className="mt-2">
              <ImageCard imageData={node.imageData} compact />
            </div>
          )}

          {/* Text content inline */}
          {isText && node.content && (
            <div className="mt-1">
              <TextCard content={node.content} compact />
            </div>
          )}
        </div>

        {/* Item count badge for categories */}
        {hasChildren && !isEditable && (
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {node.children?.length}
          </span>
        )}

        {/* Action buttons - only show in edit mode */}
        {isEditable && !isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isContainer && (
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

      {/* Add Child Dialog (for context menu) */}
      <AddNodeDialog
        onAdd={handleAddChild}
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {/* Add Sibling Dialog */}
      <AddNodeDialog
        onAdd={handleAddSibling}
        open={showSiblingDialog}
        onOpenChange={setShowSiblingDialog}
      />

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
              onAddSibling={onAddSibling}
              onDeleteNode={onDeleteNode}
              selectedNodePath={selectedNodePath}
              onSelectNode={onSelectNode}
              editingNodePath={editingNodePath}
              onStartEdit={onStartEdit}
              onOpenEditDialog={onOpenEditDialog}
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
        onEdit={() => onStartEdit?.(nodePath)}
        onEditProperties={() => onOpenEditDialog?.(nodePath)}
        onAddChild={() => setShowAddDialog(true)}
        onAddSibling={() => setShowSiblingDialog(true)}
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
