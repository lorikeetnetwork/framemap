import { memo, useMemo } from "react";
import { CanvasNode, CanvasConnection } from "@/types/canvas";

interface CanvasConnectionsProps {
  nodes: CanvasNode[];
  connections: CanvasConnection[];
}

const CanvasConnections = memo(({ nodes, connections }: CanvasConnectionsProps) => {
  const nodeMap = useMemo(() => {
    const map = new Map<string, CanvasNode>();
    nodes.forEach((node) => map.set(node.id, node));
    return map;
  }, [nodes]);

  const paths = useMemo(() => {
    return connections.map((conn) => {
      const fromNode = nodeMap.get(conn.from);
      const toNode = nodeMap.get(conn.to);

      if (!fromNode || !toNode) return null;

      // Calculate connection points (right side of from, left side of to)
      const fromX = fromNode.x + fromNode.width;
      const fromY = fromNode.y + fromNode.height / 2;
      const toX = toNode.x;
      const toY = toNode.y + toNode.height / 2;

      // Create a bezier curve
      const midX = (fromX + toX) / 2;
      const controlOffset = Math.min(Math.abs(toX - fromX) / 2, 100);

      const path = `M ${fromX} ${fromY} C ${fromX + controlOffset} ${fromY}, ${toX - controlOffset} ${toY}, ${toX} ${toY}`;

      return {
        key: `${conn.from}-${conn.to}`,
        path,
      };
    }).filter(Boolean);
  }, [connections, nodeMap]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="hsl(var(--border))"
          />
        </marker>
      </defs>
      {paths.map((p) => p && (
        <path
          key={p.key}
          d={p.path}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      ))}
    </svg>
  );
});

CanvasConnections.displayName = "CanvasConnections";

export default CanvasConnections;
