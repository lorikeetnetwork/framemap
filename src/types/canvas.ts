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

export type LineStyle = "solid" | "dashed" | "dotted";
export type ArrowType = "none" | "start" | "end" | "both";

export interface Relationship {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  lineStyle: LineStyle;
  lineColor?: string;
  arrowType: ArrowType;
}

export interface CanvasState {
  nodes: CanvasNode[];
  connections: CanvasConnection[];
  relationships: Relationship[];
  zoom: number;
  panX: number;
  panY: number;
}
