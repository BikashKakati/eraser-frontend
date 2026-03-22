import type { AppNode, CustomEdge } from './index';
import type { Tool } from './zustand-types';
import type { NodeChange, EdgeChange, Connection, Position } from '@xyflow/react';

export interface CanvasSlice {
  nodes: AppNode[];
  edges: CustomEdge[];
  initializeCanvasData: (nodes: AppNode[], edges: CustomEdge[]) => void;
  updateShapeNode: (id: string, updates: { text?: string; width?: number; height?: number }) => void;
  onNodesChange: (changes: NodeChange<AppNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<CustomEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  updateAnchorPositions: (changes: NodeChange<AppNode>[], anchorPositionChanges: NodeChange<AppNode>[]) => void;
}

export interface InteractionSlice {
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
  anchorNodeDetails: { sourceNodeId: string, targetNodeId: string } | null;
  drawingShapeDetails: { id: string, startPosition: { x: number, y: number } } | null;
  initializeArrowFromExternal: () => void;
  startFreehandDraw: (flowPosition: { x: number, y: number }) => void;
  updateFreehandDraw: (flowPosition: { x: number, y: number }) => void;
  finalizeFreehandDraw: () => void;
}

export type EditorStoreType = CanvasSlice & InteractionSlice;
