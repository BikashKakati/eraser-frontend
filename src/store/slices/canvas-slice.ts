import type { StateCreator } from 'zustand';
import type { EditorStoreType, CanvasSlice } from '../../types/store-types';
import {
  initializeCanvasDataAction,
  updateShapeNodeAction,
  onNodesChangeAction,
  onEdgesChangeAction,
  onConnectAction,
  updateAnchorPositionsAction,
} from '../actions/canvas-actions';

export const createCanvasSlice: StateCreator<EditorStoreType, [], [], CanvasSlice> = (set, _get) => ({
  nodes: [],
  edges: [],
  initializeCanvasData: (nodes, edges) => set((state: EditorStoreType) => initializeCanvasDataAction(state, nodes, edges)),
  updateShapeNode: (id, updates) => set((state: EditorStoreType) => updateShapeNodeAction(state, id, updates)),
  onNodesChange: (changes) => set((state: EditorStoreType) => onNodesChangeAction(state, changes)),
  onEdgesChange: (changes) => set((state: EditorStoreType) => onEdgesChangeAction(state, changes)),
  onConnect: (connection) => set((state: EditorStoreType) => onConnectAction(state, connection)),
  updateAnchorPositions: (changes, anchorChanges) => set((state: EditorStoreType) => updateAnchorPositionsAction(state, changes, anchorChanges) || {}),
});
