import { memo, useMemo } from "react";
import { CanvasNode, Relationship } from "@/types/canvas";
import { useCanvasTheme } from "@/contexts/CanvasThemeContext";

interface RelationshipLinesProps {
  nodes: CanvasNode[];
  relationships: Relationship[];
  onRelationshipClick?: (id: string) => void;
}

const RelationshipLines = memo(
  ({ nodes, relationships, onRelationshipClick }: RelationshipLinesProps) => {
    const { theme } = useCanvasTheme();

    const nodeMap = useMemo(() => {
      const map = new Map<string, CanvasNode>();
      nodes.forEach((node) => map.set(node.id, node));
      return map;
    }, [nodes]);

    const paths = useMemo(() => {
      return relationships
        .map((rel) => {
          const fromNode = nodeMap.get(rel.fromNodeId);
          const toNode = nodeMap.get(rel.toNodeId);

          if (!fromNode || !toNode) return null;

          // Calculate center points
          const fromCenterX = fromNode.x + fromNode.width / 2;
          const fromCenterY = fromNode.y + fromNode.height / 2;
          const toCenterX = toNode.x + toNode.width / 2;
          const toCenterY = toNode.y + toNode.height / 2;

          // Calculate the best connection points based on relative positions
          const dx = toCenterX - fromCenterX;
          const dy = toCenterY - fromCenterY;

          let fromX: number, fromY: number, toX: number, toY: number;

          if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal relationship
            if (dx > 0) {
              fromX = fromNode.x + fromNode.width;
              toX = toNode.x;
            } else {
              fromX = fromNode.x;
              toX = toNode.x + toNode.width;
            }
            fromY = fromCenterY;
            toY = toCenterY;
          } else {
            // Vertical relationship
            if (dy > 0) {
              fromY = fromNode.y + fromNode.height;
              toY = toNode.y;
            } else {
              fromY = fromNode.y;
              toY = toNode.y + toNode.height;
            }
            fromX = fromCenterX;
            toX = toCenterX;
          }

          // Create curved path
          const midX = (fromX + toX) / 2;
          const midY = (fromY + toY) / 2;
          const controlOffset = Math.min(
            Math.sqrt(dx * dx + dy * dy) / 3,
            100
          );

          // Offset the curve perpendicular to the line
          const angle = Math.atan2(dy, dx);
          const perpAngle = angle + Math.PI / 2;
          const curveOffsetX = Math.cos(perpAngle) * controlOffset * 0.5;
          const curveOffsetY = Math.sin(perpAngle) * controlOffset * 0.5;

          const path = `M ${fromX} ${fromY} Q ${midX + curveOffsetX} ${midY + curveOffsetY}, ${toX} ${toY}`;

          // Dash pattern based on line style
          let dashArray = "";
          switch (rel.lineStyle) {
            case "dashed":
              dashArray = "8 4";
              break;
            case "dotted":
              dashArray = "2 4";
              break;
          }

          return {
            key: rel.id,
            path,
            dashArray,
            color: rel.lineColor || theme.colors.branchColors[0],
            label: rel.label,
            labelX: midX + curveOffsetX,
            labelY: midY + curveOffsetY,
            arrowType: rel.arrowType,
            startX: fromX,
            startY: fromY,
            endX: toX,
            endY: toY,
            angle: Math.atan2(toY - fromY, toX - fromX),
          };
        })
        .filter(Boolean);
    }, [relationships, nodeMap, theme]);

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Arrow markers for relationships */}
          <marker
            id="rel-arrow-end"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
          </marker>
          <marker
            id="rel-arrow-start"
            markerWidth="10"
            markerHeight="7"
            refX="1"
            refY="3.5"
            orient="auto-start-reverse"
          >
            <polygon points="10 0, 0 3.5, 10 7" fill="currentColor" />
          </marker>
        </defs>

        {paths.map(
          (p) =>
            p && (
              <g key={p.key}>
                {/* Clickable hit area */}
                <path
                  d={p.path}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="16"
                  className="pointer-events-auto cursor-pointer"
                  onClick={() => onRelationshipClick?.(p.key)}
                />
                {/* Visible line */}
                <path
                  d={p.path}
                  fill="none"
                  stroke={p.color}
                  strokeWidth="2"
                  strokeDasharray={p.dashArray}
                  markerEnd={
                    p.arrowType === "end" || p.arrowType === "both"
                      ? "url(#rel-arrow-end)"
                      : undefined
                  }
                  markerStart={
                    p.arrowType === "start" || p.arrowType === "both"
                      ? "url(#rel-arrow-start)"
                      : undefined
                  }
                  style={{ color: p.color }}
                />
                {/* Label */}
                {p.label && (
                  <g>
                    <rect
                      x={p.labelX - 30}
                      y={p.labelY - 10}
                      width="60"
                      height="20"
                      fill={theme.colors.nodeBackground}
                      stroke={p.color}
                      strokeWidth="1"
                      rx="4"
                    />
                    <text
                      x={p.labelX}
                      y={p.labelY + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fill={theme.colors.nodeText}
                      className="pointer-events-none"
                    >
                      {p.label.length > 8
                        ? p.label.substring(0, 8) + "..."
                        : p.label}
                    </text>
                  </g>
                )}
              </g>
            )
        )}
      </svg>
    );
  }
);

RelationshipLines.displayName = "RelationshipLines";

export default RelationshipLines;
