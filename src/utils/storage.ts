import type { AppNode, CustomEdge } from "../types";

export interface CanvasData {
  nodes: AppNode[];
  edges: CustomEdge[];
}

export interface StorageDriver {
  getCanvas(id: string): Promise<CanvasData | null>;
  saveCanvas(id: string, data: CanvasData): Promise<void>;
}


export const localStorageDriver: StorageDriver = {
  getCanvas: async (id: string) => {
    try {
      const data = localStorage.getItem(`flowbit-canvas-${id}`);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error("Failed to read from localStorage", err);
      return null;
    }
  },
  saveCanvas: async (id: string, data: CanvasData) => {
    try {
      localStorage.setItem(`flowbit-canvas-${id}`, JSON.stringify(data));
    } catch (err) {
      console.error("Failed to write to localStorage", err);
    }
  },
};


export const backendApiDriver: StorageDriver = {
  getCanvas: async (_id: string) => {
    // const res = await fetch(`/api/canvas/${id}`);
    // return res.json();
    return null;
  },
  saveCanvas: async (_id: string, _data: CanvasData) => {
    console.debug(`[Background Sync] Saving canvas ${_id} to API (debounced)`);
    // await fetch(`/api/canvas/${id}`, {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    return Promise.resolve();
  },
};
