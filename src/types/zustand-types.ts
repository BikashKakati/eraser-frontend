import { Position } from '@xyflow/react';

export type Tool = 'select' | 'rectangle' | 'circle' | 'arrow' | 'pan_zoom';

export type ActiveToolStoreType = {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  drawingArrowFrom: { 
    x: number, 
    y: number,
    parentId?: string,
    relativeX?: number,
    relativeY?: number,
    handlePosition?: Position
  } | null;
  setDrawingArrowFrom: (pos: { 
    x: number, 
    y: number,
    parentId?: string,
    relativeX?: number,
    relativeY?: number,
    handlePosition?: Position
  } | null) => void;
};