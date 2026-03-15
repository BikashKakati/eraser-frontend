import { create } from "zustand";
import {
  type Connection,
  type EdgeChange,
  type NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import type { AppNode, CustomEdge } from "../types";

export interface CanvasStoreType {
  nodes: AppNode[];
  edges: CustomEdge[];
  setNodes: (
    nodesOrUpdater: AppNode[] | ((nodes: AppNode[]) => AppNode[])
  ) => void;
  setEdges: (
    edgesOrUpdater: CustomEdge[] | ((edges: CustomEdge[]) => CustomEdge[])
  ) => void;
  onNodesChange: (changes: NodeChange<AppNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<CustomEdge>[]) => void;
  onConnect: (connection: Connection) => void;
}

export const useCanvasStore = create<CanvasStoreType>((set, get) => ({
  nodes: [],
  edges: [],
  setNodes: (nodesOrUpdater) => {
    set((state) => ({
      nodes:
        typeof nodesOrUpdater === "function"
          ? nodesOrUpdater(state.nodes)
          : nodesOrUpdater,
    }));
  },
  setEdges: (edgesOrUpdater) => {
    set((state) => ({
      edges:
        typeof edgesOrUpdater === "function"
          ? edgesOrUpdater(state.edges)
          : edgesOrUpdater,
    }));
  },
  onNodesChange: (changes: NodeChange<AppNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as AppNode[],
    });
  },
  onEdgesChange: (changes: EdgeChange<CustomEdge>[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as CustomEdge[],
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges) as CustomEdge[],
    });
  },
}));
