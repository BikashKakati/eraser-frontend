import { create } from "zustand";
import type { ActiveToolStoreType } from "../types/zustand-types";

export const useActiveToolStore = create<ActiveToolStoreType>((set) => ({
  activeTool: "select",
  setActiveTool: (tool) => set({ activeTool: tool }),
  drawingArrowFrom: null,
  setDrawingArrowFrom: (pos) => set({ drawingArrowFrom: pos }),
}));
