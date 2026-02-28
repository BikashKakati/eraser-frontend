import { create } from "zustand";
import type { ActiveToolStoreType } from "../types/zustand-types";

export const useActiveToolStore = create<ActiveToolStoreType>((set) => ({
  activeTool: "arrow",
  setActiveTool: (tool) => set({ activeTool: tool }),
}));
