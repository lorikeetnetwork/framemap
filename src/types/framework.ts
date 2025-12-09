export interface FrameworkNode {
  name: string;
  url?: string;
  children?: FrameworkNode[];
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
}
