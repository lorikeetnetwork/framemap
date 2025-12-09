import { ChevronRight, ExternalLink, Folder, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { TreeNodeProps } from "@/types/framework";

const TreeNode = ({
  node,
  level,
  searchTerm,
  expandedNodes,
  toggleNode,
  nodePath,
  isLast,
  matchedPaths,
}: TreeNodeProps) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(nodePath);
  const isLink = !!node.url;
  const isMatched = matchedPaths.has(nodePath);
  const isHighlighted = searchTerm && node.name.toLowerCase().includes(searchTerm.toLowerCase());

  const handleClick = () => {
    if (isLink && node.url) {
      window.open(node.url, "_blank", "noopener,noreferrer");
    } else if (hasChildren) {
      toggleNode(nodePath);
    }
  };

  return (
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
        className={cn(
          "group flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-all duration-200",
          "hover:bg-tree-node-hover",
          isHighlighted && "bg-primary/20 ring-1 ring-primary/50",
          isMatched && !isHighlighted && "bg-secondary/50"
        )}
      >
        {/* Expand/collapse icon or node type icon */}
        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
          {hasChildren ? (
            <ChevronRight
              className={cn(
                "w-4 h-4 text-primary transition-transform duration-200",
                isExpanded && "rotate-90"
              )}
            />
          ) : isLink ? (
            <ExternalLink className="w-3 h-3 text-link" />
          ) : (
            <FileText className="w-3 h-3 text-muted-foreground" />
          )}
        </span>

        {/* Folder icon for categories */}
        {hasChildren && (
          <Folder
            className={cn(
              "w-4 h-4 transition-colors duration-200",
              isExpanded ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}
          />
        )}

        {/* Node label */}
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
            isHighlighted && "font-semibold text-primary"
          )}
        >
          {node.name}
        </span>

        {/* Item count badge for categories */}
        {hasChildren && (
          <span className="ml-auto text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {node.children?.length}
          </span>
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
