import { create } from 'zustand';
import type { Space } from '../services/api/space-service';
import type { FlowMetadata } from '../services/api/flow-service';

export interface WorkspaceState {
    spaces: Space[];
    flows: FlowMetadata[];
    fetchedSpaceIds: string[];
    activeSpaceId: string | null;
    setSpaces: (spaces: Space[]) => void;
    addSpace: (space: Space) => void;
    setFlowsForSpace: (spaceId: string, spaceFlows: FlowMetadata[]) => void;
    addFlow: (flow: FlowMetadata) => void;
    setActiveSpaceId: (id: string | null) => void;
    getFlowById: (id: string) => FlowMetadata | undefined;
    getFlowsBySpaceId: (spaceId: string) => FlowMetadata[];
    hasFetchedFlowsForSpace: (spaceId: string) => boolean;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
    spaces: [],
    flows: [],
    fetchedSpaceIds: [],
    activeSpaceId: null,

    setSpaces: (spaces) => set({ spaces }),
    addSpace: (space) => set((state) => ({ spaces: [...state.spaces, space] })),

    setFlowsForSpace: (spaceId, spaceFlows) => set((state) => {
        const filteredFlows = state.flows.filter((f) => f.spaceId !== spaceId);
        return { 
            flows: [...filteredFlows, ...spaceFlows],
            fetchedSpaceIds: [...new Set([...state.fetchedSpaceIds, spaceId])]
        };
    }),
    
    addFlow: (flow) => set((state) => ({ flows: [...state.flows, flow] })),

    setActiveSpaceId: (activeSpaceId) => set({ activeSpaceId }),

    getFlowById: (id) => get().flows.find((f) => f.id === id),
    
    getFlowsBySpaceId: (spaceId) => get().flows.filter((f) => f.spaceId === spaceId),
    
    hasFetchedFlowsForSpace: (spaceId) => get().fetchedSpaceIds.includes(spaceId),
}));
