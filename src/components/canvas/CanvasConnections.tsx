import { memo, useMemo } from "react";
import { CanvasNode, CanvasConnection } from "@/types/canvas";
import { useCanvasTheme } from "@/contexts/CanvasThemeContext";

interface CanvasConnectionsProps {
  nodes: CanvasNode[];
  connections: CanvasConnection[];
}

const CanvasConnections = memo(
  ({ nodes, connections }: CanvasConnectionsProps) => {
    const { theme, coloredBranches, layoutType } = useCanvasTheme();

    const nodeMap = useMemo(() => {
      const map = new Map<string, CanvasNode>();
      nodes.forEach((node) => map.set(node.id, node));
      return map;
    }, [nodes]);

    // Calculate node depths for colored branches
    const nodeDepths = useMemo(() => {
      const depths = new Map<string, number>();
      nodes.forEach((node) => {
        const parts = node.id.split("/");
        depths.set(node.id, parts.length - 1);
      });
      return depths;
    }, [nodes]);

    const paths = useMemo(() => {
      return connections
        .map((conn) => {
          const fromNode = nodeMap.get(conn.from);
          const toNode = nodeMap.get(conn.to);

          if (!fromNode || !toNode) return null;

          let fromX: number, fromY: number, toX: number, toY: number;
          let path: string;

          switch (layoutType) {
            case "org-chart": {
              // Connect from bottom of parent to top of child
              fromX = fromNode.x + fromNode.width / 2;
              fromY = fromNode.y + fromNode.height;
              toX = toNode.x + toNode.width / 2;
              toY = toNode.y;

              const midY = (fromY + toY) / 2;
              path = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
              break;
            }

            case "mind-map": {
              // Connect based on relative position
              const fromCenterX = fromNode.x + fromNode.width / 2;
              const toCenterX = toNode.x + toNode.width / 2;

              if (toCenterX > fromCenterX) {
                // Child is to the right
                fromX = fromNode.x + fromNode.width;
                toX = toNode.x;
              } else {
                // Child is to the left
                fromX = fromNode.x;
                toX = toNode.x + toNode.width;
              }
              fromY = fromNode.y + fromNode.height / 2;
              toY = toNode.y + toNode.height / 2;

              const controlOffset = Math.abs(toX - fromX) / 2;
              path = `M ${fromX} ${fromY} C ${fromX + (toCenterX > fromCenterX ? controlOffset : -controlOffset)} ${fromY}, ${toX + (toCenterX > fromCenterX ? -controlOffset : controlOffset)} ${toY}, ${toX} ${toY}`;
              break;
            }

            case "radial": {
              // Connect from center points with curves
              const fromCenterX = fromNode.x + fromNode.width / 2;
              const fromCenterY = fromNode.y + fromNode.height / 2;
              const toCenterX = toNode.x + toNode.width / 2;
              const toCenterY = toNode.y + toNode.height / 2;

              // Calculate edge intersection points
              const angle = Math.atan2(
                toCenterY - fromCenterY,
                toCenterX - fromCenterX
              );
              fromX = fromCenterX + Math.cos(angle) * (fromNode.width / 2);
              fromY = fromCenterY + Math.sin(angle) * (fromNode.height / 2);
              toX = toCenterX - Math.cos(angle) * (toNode.width / 2);
              toY = toCenterY - Math.sin(angle) * (toNode.height / 2);

              path = `M ${fromX} ${fromY} L ${toX} ${toY}`;
              break;
            }

            case "tree":
            default: {
              // Original tree layout: right to left
              fromX = fromNode.x + fromNode.width;
              fromY = fromNode.y + fromNode.height / 2;
              toX = toNode.x;
              toY = toNode.y + toNode.height / 2;

              const midX = (fromX + toX) / 2;
              const controlOffset = Math.min(Math.abs(toX - fromX) / 2, 100);
              path = `M ${fromX} ${fromY} C ${fromX + controlOffset} ${fromY}, ${toX - controlOffset} ${toY}, ${toX} ${toY}`;
              break;
            }
          }

          // Get color based on depth if colored branches enabled
          const depth = nodeDepths.get(conn.to) || 0;
          const branchColor = coloredBranches
            ? theme.colors.branchColors[depth % theme.colors.branchColors.length]
            : theme.colors.connection;

          return {
            key: `${conn.from}-${conn.to}`,
            path,
            color: branchColor,
          };
        })
        .filter(Boolean);
    }, [connections, nodeMap, layoutType, coloredBranches, theme, nodeDepths]);

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
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
              fill={theme.colors.connection}
            />
          </marker>
        </defs>
        {paths.map(
          (p) =>
            p && (
              <path
                key={p.key}
                d={p.path}
                fill="none"
                stroke={p.color}
                strokeWidth="2"
              />
            )
        )}
      </svg>
    );
  }
);

CanvasConnections.displayName = "CanvasConnections";

export default CanvasConnections;
