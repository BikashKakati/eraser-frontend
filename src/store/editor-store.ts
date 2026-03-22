import { create } from 'zustand';
import { createCanvasSlice } from './slices/canvas-slice';
import { createInteractionSlice } from './slices/interaction-slice';
import type { EditorStoreType } from '../types/store-types';

export const useEditorStore = create<EditorStoreType>()((...a) => ({
  ...createCanvasSlice(...a),
  ...createInteractionSlice(...a),
}));
