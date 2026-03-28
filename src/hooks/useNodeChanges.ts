import { type NodeChange } from '@xyflow/react';
import { useCallback } from 'react';
import { useEditorStore } from '../store/editor-store';
import { sidebarTools } from '../constant';
import type { AppNode } from '../types';

export function useNodeChanges() {
  const { activeTool, nodes, updateAnchorPositions, onNodesChange: onBaseNodesChange } = useEditorStore();

  const handleNodeChange = useCallback(
    (nodeChanges: NodeChange<AppNode>[]) => {
      if (activeTool === sidebarTools.ARROW) return;
      const anchorPositionChanges = nodeChanges.filter(
        (c) =>
          c.type === 'position' &&
          nodes.find((n) => n.id === c.id)?.type === 'anchor'
      );

      // If we are moving endpoints
      if (anchorPositionChanges.length > 0) {
        updateAnchorPositions(nodeChanges, anchorPositionChanges);
        return;
      }

      // Default cascade
      onBaseNodesChange(nodeChanges);
    },
    [activeTool, nodes, updateAnchorPositions, onBaseNodesChange]
  );

  return { handleNodeChange };
}
