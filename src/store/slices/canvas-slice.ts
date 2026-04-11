import type { StateCreator } from 'zustand';
import type { EditorStoreType, CanvasSlice } from '../../types/store-types';
import {
  initializeCanvasDataAction,
  updateShapeNodeAction,
  updateEdgeStyleAction,
  deleteElementsAction,
  onNodesChangeAction,
  onEdgesChangeAction,
  onConnectAction,
  updateAnchorPositionsAction,
  createGroupAction,
  ungroupAction,
} from '../actions/canvas-actions';

export const createCanvasSlice: StateCreator<EditorStoreType, [], [], CanvasSlice> = (set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeIds: [],
  selectedEdgeIds: [],
  initializeCanvasData: (nodes, edges) => set((state: EditorStoreType) => initializeCanvasDataAction(state, nodes, edges)),
  updateShapeNode: (id, updates) => {
    get().commitHistory();
    set((state: EditorStoreType) => updateShapeNodeAction(state, id, updates));
  },
  updateEdgeStyle: (id, updates) => {
    get().commitHistory();
    set((state: EditorStoreType) => updateEdgeStyleAction(state, id, updates));
  },
  deleteElements: (ids, type) => {
    get().commitHistory();
    set((state: EditorStoreType) => deleteElementsAction(state, ids, type));
  },
  onNodesChange: (changes) => set((state: EditorStoreType) => onNodesChangeAction(state, changes)),
  onEdgesChange: (changes) => set((state: EditorStoreType) => onEdgesChangeAction(state, changes)),
  onConnect: (connection) => {
    get().commitHistory();
    set((state: EditorStoreType) => onConnectAction(state, connection));
  },
  updateAnchorPositions: (changes, anchorChanges) => set((state: EditorStoreType) => updateAnchorPositionsAction(state, changes, anchorChanges) || {}),
  createGroup: () => {
    get().commitHistory();
    set((state: EditorStoreType) => createGroupAction(state));
  },
  ungroup: () => {
    get().commitHistory();
    set((state: EditorStoreType) => ungroupAction(state));
  },
});
