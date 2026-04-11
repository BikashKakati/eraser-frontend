import type { StateCreator } from 'zustand';
import type { EditorStoreType, HistorySlice } from '../../types/store-types';
import {
    setActiveFlowAction,
    commitHistoryAction,
    undoHistoryAction,
    redoHistoryAction
} from '../actions/history-actions';

export const createHistorySlice: StateCreator<EditorStoreType, [], [], HistorySlice> = (set, _get) => ({
    activeFlowId: null,
    past: [],
    future: [],

    setActiveFlow: (flowId) => set((state: EditorStoreType) => setActiveFlowAction(state, flowId)),
    commitHistory: () => set((state: EditorStoreType) => commitHistoryAction(state)),
    undoHistory: () => set((state: EditorStoreType) => undoHistoryAction(state)),
    redoHistory: () => set((state: EditorStoreType) => redoHistoryAction(state)),
});
