import type { Position } from '@xyflow/react';
import type { EditorStoreType } from '../../types/store-types';
import type { Tool } from '../../types/zustand-types';
import { sidebarTools } from '../../constant';

export const setActiveToolAction = (
  state: EditorStoreType,
  tool: Tool
): Partial<EditorStoreType> => {
  if (tool !== sidebarTools.SELECT) {
    const newNodes = state.nodes.map(node => ({ ...node, selected: false }));
    const newEdges = state.edges.map(edge => ({ ...edge, selected: false }));
    return { 
      activeTool: tool, 
      nodes: newNodes, 
      edges: newEdges,
      selectedNodeIds: [],
      selectedEdgeIds: []
    };
  }
  return { activeTool: tool };
};

export const setDrawingArrowFromAction = (
  _state: EditorStoreType,
  pos: { 
    x: number, 
    y: number,
    parentId?: string,
    relativeX?: number,
    relativeY?: number,
    handlePosition?: Position
  } | null
): Partial<EditorStoreType> => {
  return { drawingArrowFrom: pos };
};
