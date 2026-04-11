import type { EditorStoreType, InteractionSlice } from '../../types/store-types';
import { setActiveToolAction, setDrawingArrowFromAction } from '../actions/interaction-actions';
import {
  initializeArrowFromExternalAction,
  startFreehandDrawAction,
  updateFreehandDrawAction,
  finalizeFreehandDrawAction
} from '../actions/editor-actions';
import type { StateCreator } from 'zustand';
import { sidebarTools } from '../../constant';

export const createInteractionSlice: StateCreator<EditorStoreType, [], [], InteractionSlice> = (set, get) => ({
  activeTool: sidebarTools.SELECT,
  drawingArrowFrom: null,
  anchorNodeDetails: null,
  drawingShapeDetails: null,

  setActiveTool: (tool) => set((state: EditorStoreType) => setActiveToolAction(state, tool)),
  setDrawingArrowFrom: (pos) => set((state: EditorStoreType) => setDrawingArrowFromAction(state, pos)),
  initializeArrowFromExternal: () => {
    get().commitHistory();
    set((state: EditorStoreType) => initializeArrowFromExternalAction(state) || {});
  },
  startFreehandDraw: (pos) => {
    get().commitHistory();
    set((state: EditorStoreType) => startFreehandDrawAction(state, pos) || {});
  },
  updateFreehandDraw: (pos) => set((state: EditorStoreType) => updateFreehandDrawAction(state, pos) || {}),
  finalizeFreehandDraw: () => set((state: EditorStoreType) => finalizeFreehandDrawAction(state) || {}),
});
