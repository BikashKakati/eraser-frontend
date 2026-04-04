import { v4 as uuidv4 } from "uuid";
import type { Node, Edge } from "@xyflow/react";

export interface Flow {
  id: string;
  spaceId: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: number;
  updatedAt: number;
}

const FLOWS_STORAGE_KEY = "flowbit_flows";

export const FlowService = {
  getAllFlowsRaw: (): Flow[] => {
    try {
      const data = localStorage.getItem(FLOWS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse flows from localStorage", e);
      return [];
    }
  },

  getFlowsBySpace: (spaceId: string): Flow[] => {
    const flows = FlowService.getAllFlowsRaw();
    return flows.filter((f) => f.spaceId === spaceId).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  getFlow: (id: string): Flow | null => {
    const flows = FlowService.getAllFlowsRaw();
    return flows.find((f) => f.id === id) || null;
  },

  createFlow: (spaceId: string, name: string): Flow => {
    const newFlow: Flow = {
      id: uuidv4(),
      spaceId,
      name,
      nodes: [],
      edges: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const allFlows = FlowService.getAllFlowsRaw();
    allFlows.push(newFlow);
    localStorage.setItem(FLOWS_STORAGE_KEY, JSON.stringify(allFlows));
    
    return newFlow;
  },

  updateFlowData: (id: string, nodes: Node[], edges: Edge[]) => {
    const allFlows = FlowService.getAllFlowsRaw();
    const index = allFlows.findIndex(f => f.id === id);
    if (index === -1) return null;

    allFlows[index].nodes = nodes;
    allFlows[index].edges = edges;
    allFlows[index].updatedAt = Date.now();
    localStorage.setItem(FLOWS_STORAGE_KEY, JSON.stringify(allFlows));
    return allFlows[index];
  },

  updateFlowName: (id: string, name: string): Flow | null => {
    const allFlows = FlowService.getAllFlowsRaw();
    const index = allFlows.findIndex(f => f.id === id);
    if (index === -1) return null;

    allFlows[index].name = name;
    allFlows[index].updatedAt = Date.now();
    localStorage.setItem(FLOWS_STORAGE_KEY, JSON.stringify(allFlows));
    return allFlows[index];
  },

  deleteFlow: (id: string): boolean => {
    const allFlows = FlowService.getAllFlowsRaw();
    const filtered = allFlows.filter(f => f.id !== id);
    if (filtered.length !== allFlows.length) {
      localStorage.setItem(FLOWS_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }
};
