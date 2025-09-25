import { create } from "zustand";
import type { StoreState } from "../types/zustand-types";

export const useStore = create<StoreState>((set) => ({
  activeTool: "select",
  setActiveTool: (tool) => set({ activeTool: tool }),
}));

