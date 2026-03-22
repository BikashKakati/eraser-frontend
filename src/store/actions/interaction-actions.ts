import type { Tool } from '../../types/zustand-types';
import type { Position } from '@xyflow/react';
import type { EditorStoreType } from '../../types/store-types';

export const setActiveToolAction = (
  _state: EditorStoreType,
  tool: Tool
): Partial<EditorStoreType> => {
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
