import { applyNodeChanges, type NodeChange } from '@xyflow/react';
import { useCallback } from 'react';
import { useActiveToolStore } from '../store/zustand-store';
import { useCanvasStore } from '../store/canvas-store';
import { sidebarTools } from '../constant';
import type { AppNode } from '../types';
import { calculateSnapTarget } from '../utils/snapping';

export function useNodeChanges() {
  const { activeTool } = useActiveToolStore();
  const { nodes, setNodes, onNodesChange: onBaseNodesChange } = useCanvasStore();

  const handleNodeChange = useCallback(
    (nodeChanges: NodeChange<AppNode>[]) => {
      // Don't intercept if dragging shapes in Arrow mode (arrows shouldn't move bases)
      if (activeTool === sidebarTools.ARROW) return;

      const anchorPositionChanges = nodeChanges.filter(
        (c) =>
          c.type === 'position' &&
          nodes.find((n) => n.id === c.id)?.type === 'anchor'
      );

      // If we are moving endpoints
      if (anchorPositionChanges.length > 0) {
        setNodes((existingNodes) => {
          const nextNodes = applyNodeChanges(nodeChanges, existingNodes) as AppNode[];

          return nextNodes.map((node) => {
            const change = anchorPositionChanges.find((c) => c.type === 'position' && c.id === node.id);
            if (change && change.type === 'position' && node.type === 'anchor') {
              let absPos = change.positionAbsolute;

              if (!absPos) {
                absPos = node.position;
                if (node.parentId) {
                  const parentNode = existingNodes.find((n) => n.id === node.parentId);
                  if (parentNode && parentNode.position) {
                    absPos = {
                      x: node.position.x + parentNode.position.x,
                      y: node.position.y + parentNode.position.y,
                    };
                  }
                }
              }

              // Evaluate the new target via snapping util
              const snapPoint = calculateSnapTarget(absPos, existingNodes);

              return {
                ...node,
                position: { x: snapPoint.x, y: snapPoint.y },
                parentId: snapPoint.snappedParentId,
                data: {
                  ...node.data,
                  handlePosition: snapPoint.handlePosition,
                },
              } as AppNode;
            }
            return node;
          });
        });
        return;
      }

      // Default cascade
      onBaseNodesChange(nodeChanges);
    },
    [activeTool, nodes, setNodes, onBaseNodesChange]
  );

  return { handleNodeChange };
}
