export type NodeType = "folder" | "link" | "note" | "task" | "topic" | "subtopic" | "image" | "text";

export interface LinkPreview {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  fetchedAt?: string;
}

export interface ImageData {
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface NodeStyle {
  fontFamily?: string;
  fontSize?: "sm" | "base" | "lg" | "xl";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  textColor?: string;
  backgroundColor?: string;
  icon?: string;
  borderStyle?: "none" | "solid" | "dashed";
  nodeShape?: "rectangle" | "rounded" | "pill";
}

export interface FrameworkNode {
  name: string;
  url?: string;
  children?: FrameworkNode[];
  type?: NodeType;
  description?: string;
  completed?: boolean;
  color?: string;
  style?: NodeStyle;
  linkPreview?: LinkPreview;
  imageData?: ImageData;
  content?: string;
}

export interface FrameworkSettings {
  defaultNodeColor?: string;
  connectionLineStyle?: 'curved' | 'straight' | 'orthogonal';
  gridVisible?: boolean;
  autoSave?: boolean;
}

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface CanvasPositions {
  [nodePath: string]: CanvasPosition;
}

export interface FrameworkMapData {
  id: string;
  name: string;
  description: string | null;
  data: FrameworkNode;
  settings: FrameworkSettings;
  canvas_positions: CanvasPositions | null;
  is_template: boolean;
  template_category: string | null;
  created_at: string;
  updated_at: string;
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
  onAddSibling?: (nodePath: string, newNode: FrameworkNode) => void;
  onDeleteNode?: (nodePath: string) => void;
  onMoveNode?: (sourcePath: string, targetPath: string, position: "before" | "after" | "inside") => void;
  selectedNodePath?: string | null;
  onSelectNode?: (nodePath: string | null) => void;
  editingNodePath?: string | null;
  onStartEdit?: (nodePath: string | null) => void;
}
