import { FrameworkNode } from "./framework";

export interface CanvasNode {
  id: string;
  node: FrameworkNode;
  x: number;
  y: number;
  width: number;
  height: number;
  parentId?: string;
}

export interface CanvasConnection {
  from: string;
  to: string;
}

export interface CanvasState {
  nodes: CanvasNode[];
  connections: CanvasConnection[];
  zoom: number;
  panX: number;
  panY: number;
}
