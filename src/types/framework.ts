export type NodeType = "folder" | "link" | "note" | "task";

export interface FrameworkNode {
  name: string;
  url?: string;
  children?: FrameworkNode[];
  type?: NodeType;
  description?: string;
  completed?: boolean;
  color?: string;
}

export interface TreeNodeProps {
  node: FrameworkNode;
  level: number;
  searchTerm: string;
  expandedNodes: Set<string>;
  toggleNode: (nodePath: string) => void;
  nodePath: string;
  isLast: boolean;
  matchedPaths: Set<string>;
  onUpdateNode?: (nodePath: string, updates: Partial<FrameworkNode>) => void;
  onAddChild?: (nodePath: string, newNode: FrameworkNode) => void;
  onDeleteNode?: (nodePath: string) => void;
  onMoveNode?: (sourcePath: string, targetPath: string, position: "before" | "after" | "inside") => void;
  isEditing?: boolean;
}
