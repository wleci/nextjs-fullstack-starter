"use client";

import { useMemo } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MarkerType,
    Position,
    type Node,
    type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { FlowchartBlock as FlowchartBlockType } from "../types";

interface Props {
    block: FlowchartBlockType;
}

const nodeDefaults = {
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
};

const nodeDefaultsLR = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
};

function getNodeStyle(type?: string, color?: string) {
    const baseStyle = {
        padding: "10px 20px",
        borderRadius: type === "decision" ? "0" : type === "start" || type === "end" ? "50px" : "8px",
        border: "2px solid",
        borderColor: color || "#3b82f6",
        background: color ? `${color}20` : "#3b82f620",
        color: "inherit",
        fontWeight: 500,
        transform: type === "decision" ? "rotate(45deg)" : undefined,
    };

    if (type === "decision") {
        return {
            ...baseStyle,
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        };
    }

    return baseStyle;
}

export function FlowchartBlock({ block }: Props) {
    const isVertical = block.direction !== "LR";
    const defaults = isVertical ? nodeDefaults : nodeDefaultsLR;

    const { nodes, edges } = useMemo(() => {
        const spacing = 150;
        const nodeMap = new Map<string, number>();
        const levels = new Map<string, number>();
        const visited = new Set<string>();

        // Find root nodes
        const hasIncoming = new Set(block.edges.map((e) => e.to));
        const roots = block.nodes.filter((n) => !hasIncoming.has(n.id));
        if (roots.length === 0 && block.nodes.length > 0) {
            roots.push(block.nodes[0]);
        }

        // BFS to assign levels
        const queue = roots.map((r) => ({ id: r.id, level: 0 }));
        while (queue.length > 0) {
            const { id, level } = queue.shift()!;
            if (visited.has(id)) continue;
            visited.add(id);
            levels.set(id, level);

            const outgoing = block.edges.filter((e) => e.from === id);
            for (const edge of outgoing) {
                if (!visited.has(edge.to)) {
                    queue.push({ id: edge.to, level: level + 1 });
                }
            }
        }

        // Group by level
        const levelGroups = new Map<number, string[]>();
        for (const node of block.nodes) {
            const level = levels.get(node.id) ?? 0;
            if (!levelGroups.has(level)) levelGroups.set(level, []);
            levelGroups.get(level)!.push(node.id);
        }

        // Calculate positions
        const flowNodes: Node[] = block.nodes.map((node) => {
            const level = levels.get(node.id) ?? 0;
            const group = levelGroups.get(level) || [node.id];
            const indexInGroup = group.indexOf(node.id);
            const offset = (group.length - 1) / 2;

            const position = isVertical
                ? { x: (indexInGroup - offset) * spacing, y: level * spacing }
                : { x: level * spacing, y: (indexInGroup - offset) * spacing };

            return {
                id: node.id,
                data: {
                    label: node.type === "decision" ? (
                        <div style={{ transform: "rotate(-45deg)" }}>{node.label}</div>
                    ) : node.label
                },
                position,
                style: getNodeStyle(node.type, node.color),
                ...defaults,
            };
        });

        const flowEdges: Edge[] = block.edges.map((edge, i) => ({
            id: `e${i}-${edge.from}-${edge.to}`,
            source: edge.from,
            target: edge.to,
            label: edge.label,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2 },
        }));

        return { nodes: flowNodes, edges: flowEdges };
    }, [block, isVertical, defaults]);

    return (
        <div className="my-6">
            {block.title && (
                <h4 className="text-lg font-semibold mb-3">{block.title}</h4>
            )}
            <div className="h-[400px] rounded-lg border border-border overflow-hidden bg-background">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    panOnDrag={true}
                    zoomOnScroll={true}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background />
                    <Controls showInteractive={false} />
                </ReactFlow>
            </div>
        </div>
    );
}
