import { FrameworkNode } from "@/types/framework";
import { CanvasNode, CanvasConnection } from "@/types/canvas";

export type LayoutType = "tree" | "org-chart" | "mind-map" | "radial";

interface LayoutResult {
  nodes: CanvasNode[];
  connections: CanvasConnection[];
}

const NODE_WIDTH = 240;
const NODE_HEIGHT = 80;
const H_SPACING = 320;
const V_SPACING = 100;

// Tree layout - horizontal left-to-right
export function treeLayout(frameworkData: FrameworkNode): LayoutResult {
  const nodes: CanvasNode[] = [];
  const connections: CanvasConnection[] = [];

  function processNode(
    node: FrameworkNode,
    parentId: string | undefined,
    level: number,
    yOffset: { value: number }
  ): number {
    const nodeId = parentId ? `${parentId}/${node.name}` : node.name;

    const x = 100 + level * H_SPACING;
    let totalChildHeight = 0;
    const childYPositions: number[] = [];

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        childYPositions.push(yOffset.value);
        const childHeight = processNode(child, nodeId, level + 1, yOffset);
        totalChildHeight += childHeight;
      });

      const firstChildY = childYPositions[0];
      const lastChildY = childYPositions[childYPositions.length - 1];
      const y = (firstChildY + lastChildY) / 2;

      nodes.push({
        id: nodeId,
        node,
        x,
        y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        parentId,
      });

      if (parentId) {
        connections.push({ from: parentId, to: nodeId });
      }

      node.children.forEach((child) => {
        const childId = `${nodeId}/${child.name}`;
        connections.push({ from: nodeId, to: childId });
      });

      return Math.max(totalChildHeight, NODE_HEIGHT + V_SPACING);
    } else {
      const y = yOffset.value;
      nodes.push({
        id: nodeId,
        node,
        x,
        y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        parentId,
      });

      if (parentId) {
        connections.push({ from: parentId, to: nodeId });
      }

      yOffset.value += NODE_HEIGHT + V_SPACING;
      return NODE_HEIGHT + V_SPACING;
    }
  }

  processNode(frameworkData, undefined, 0, { value: 100 });

  const uniqueConnections = connections.filter(
    (conn, idx, arr) =>
      arr.findIndex((c) => c.from === conn.from && c.to === conn.to) === idx
  );

  return { nodes, connections: uniqueConnections };
}

// Org Chart layout - top-to-bottom hierarchical
export function orgChartLayout(frameworkData: FrameworkNode): LayoutResult {
  const nodes: CanvasNode[] = [];
  const connections: CanvasConnection[] = [];
  const levelWidths: Map<number, number> = new Map();

  // First pass: calculate width needed at each level
  function calculateWidths(node: FrameworkNode, level: number): number {
    if (!node.children || node.children.length === 0) {
      return NODE_WIDTH + 40;
    }
    const childrenWidth = node.children.reduce(
      (sum, child) => sum + calculateWidths(child, level + 1),
      0
    );
    const currentWidth = levelWidths.get(level) || 0;
    levelWidths.set(level, currentWidth + Math.max(NODE_WIDTH + 40, childrenWidth));
    return Math.max(NODE_WIDTH + 40, childrenWidth);
  }

  calculateWidths(frameworkData, 0);

  function processNode(
    node: FrameworkNode,
    parentId: string | undefined,
    level: number,
    xOffset: number,
    availableWidth: number
  ): void {
    const nodeId = parentId ? `${parentId}/${node.name}` : node.name;
    const y = 100 + level * (NODE_HEIGHT + V_SPACING);
    const x = xOffset + availableWidth / 2 - NODE_WIDTH / 2;

    nodes.push({
      id: nodeId,
      node,
      x,
      y,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      parentId,
    });

    if (parentId) {
      connections.push({ from: parentId, to: nodeId });
    }

    if (node.children && node.children.length > 0) {
      const childWidths = node.children.map((child) =>
        calculateChildWidth(child)
      );
      const totalChildWidth = childWidths.reduce((a, b) => a + b, 0);
      let childX = xOffset + (availableWidth - totalChildWidth) / 2;

      node.children.forEach((child, idx) => {
        processNode(child, nodeId, level + 1, childX, childWidths[idx]);
        childX += childWidths[idx];
      });
    }
  }

  function calculateChildWidth(node: FrameworkNode): number {
    if (!node.children || node.children.length === 0) {
      return NODE_WIDTH + 60;
    }
    return node.children.reduce(
      (sum, child) => sum + calculateChildWidth(child),
      0
    );
  }

  const totalWidth = calculateChildWidth(frameworkData);
  processNode(frameworkData, undefined, 0, 100, Math.max(totalWidth, NODE_WIDTH + 100));

  return { nodes, connections };
}

// Mind Map layout - central root with branches radiating left/right
export function mindMapLayout(frameworkData: FrameworkNode): LayoutResult {
  const nodes: CanvasNode[] = [];
  const connections: CanvasConnection[] = [];

  const centerX = 600;
  const centerY = 400;

  // Add root node at center
  const rootId = frameworkData.name;
  nodes.push({
    id: rootId,
    node: frameworkData,
    x: centerX - NODE_WIDTH / 2,
    y: centerY - NODE_HEIGHT / 2,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    parentId: undefined,
  });

  if (!frameworkData.children || frameworkData.children.length === 0) {
    return { nodes, connections };
  }

  // Split children into left and right sides
  const children = frameworkData.children;
  const leftChildren = children.slice(0, Math.ceil(children.length / 2));
  const rightChildren = children.slice(Math.ceil(children.length / 2));

  function processChildren(
    childNodes: FrameworkNode[],
    parentId: string,
    direction: "left" | "right",
    startY: number
  ) {
    const xDirection = direction === "left" ? -1 : 1;
    const baseX =
      direction === "left"
        ? centerX - NODE_WIDTH / 2 - H_SPACING
        : centerX + NODE_WIDTH / 2 + H_SPACING - NODE_WIDTH;

    let currentY = startY;

    childNodes.forEach((child) => {
      const childId = `${parentId}/${child.name}`;
      const subtreeHeight = calculateSubtreeHeight(child);

      const nodeY = currentY + subtreeHeight / 2 - NODE_HEIGHT / 2;

      nodes.push({
        id: childId,
        node: child,
        x: baseX,
        y: nodeY,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        parentId,
      });

      connections.push({ from: parentId, to: childId });

      if (child.children && child.children.length > 0) {
        processSubtree(child.children, childId, direction, currentY, 2);
      }

      currentY += subtreeHeight;
    });
  }

  function processSubtree(
    childNodes: FrameworkNode[],
    parentId: string,
    direction: "left" | "right",
    startY: number,
    level: number
  ) {
    const xDirection = direction === "left" ? -1 : 1;
    const baseX =
      direction === "left"
        ? centerX - NODE_WIDTH / 2 - H_SPACING * level
        : centerX + NODE_WIDTH / 2 + H_SPACING * level - NODE_WIDTH;

    let currentY = startY;

    childNodes.forEach((child) => {
      const childId = `${parentId}/${child.name}`;
      const subtreeHeight = calculateSubtreeHeight(child);

      const nodeY = currentY + subtreeHeight / 2 - NODE_HEIGHT / 2;

      nodes.push({
        id: childId,
        node: child,
        x: baseX,
        y: nodeY,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        parentId,
      });

      connections.push({ from: parentId, to: childId });

      if (child.children && child.children.length > 0) {
        processSubtree(child.children, childId, direction, currentY, level + 1);
      }

      currentY += subtreeHeight;
    });
  }

  function calculateSubtreeHeight(node: FrameworkNode): number {
    if (!node.children || node.children.length === 0) {
      return NODE_HEIGHT + V_SPACING;
    }
    return node.children.reduce(
      (sum, child) => sum + calculateSubtreeHeight(child),
      0
    );
  }

  const leftHeight = leftChildren.reduce(
    (sum, child) => sum + calculateSubtreeHeight(child),
    0
  );
  const rightHeight = rightChildren.reduce(
    (sum, child) => sum + calculateSubtreeHeight(child),
    0
  );

  const leftStartY = centerY - leftHeight / 2;
  const rightStartY = centerY - rightHeight / 2;

  processChildren(leftChildren, rootId, "left", leftStartY);
  processChildren(rightChildren, rootId, "right", rightStartY);

  return { nodes, connections };
}

// Radial layout - circular arrangement
export function radialLayout(frameworkData: FrameworkNode): LayoutResult {
  const nodes: CanvasNode[] = [];
  const connections: CanvasConnection[] = [];

  const centerX = 800;
  const centerY = 500;
  const baseRadius = 300;

  // Add root at center
  const rootId = frameworkData.name;
  nodes.push({
    id: rootId,
    node: frameworkData,
    x: centerX - NODE_WIDTH / 2,
    y: centerY - NODE_HEIGHT / 2,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    parentId: undefined,
  });

  if (!frameworkData.children || frameworkData.children.length === 0) {
    return { nodes, connections };
  }

  function processLevel(
    childNodes: FrameworkNode[],
    parentId: string,
    level: number,
    startAngle: number,
    endAngle: number
  ) {
    const radius = baseRadius * level;
    const angleStep = (endAngle - startAngle) / childNodes.length;

    childNodes.forEach((child, idx) => {
      const angle = startAngle + angleStep * (idx + 0.5);
      const x = centerX + Math.cos(angle) * radius - NODE_WIDTH / 2;
      const y = centerY + Math.sin(angle) * radius - NODE_HEIGHT / 2;

      const childId = `${parentId}/${child.name}`;

      nodes.push({
        id: childId,
        node: child,
        x,
        y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        parentId,
      });

      connections.push({ from: parentId, to: childId });

      if (child.children && child.children.length > 0) {
        const childStartAngle = startAngle + angleStep * idx;
        const childEndAngle = startAngle + angleStep * (idx + 1);
        processLevel(
          child.children,
          childId,
          level + 1,
          childStartAngle,
          childEndAngle
        );
      }
    });
  }

  processLevel(
    frameworkData.children,
    rootId,
    1,
    0,
    Math.PI * 2
  );

  return { nodes, connections };
}

// Main layout function
export function applyLayout(
  frameworkData: FrameworkNode,
  layoutType: LayoutType
): LayoutResult {
  switch (layoutType) {
    case "org-chart":
      return orgChartLayout(frameworkData);
    case "mind-map":
      return mindMapLayout(frameworkData);
    case "radial":
      return radialLayout(frameworkData);
    case "tree":
    default:
      return treeLayout(frameworkData);
  }
}
