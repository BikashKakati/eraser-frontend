import { type ShapeNode } from "../types";
import type { SidebarTools } from "../types/sidebar-types";

export const tempNodes: ShapeNode[] = []

export const sidebarTools: SidebarTools = {
    SELECT: "select",
    RECTANGLE: "rectangle",
    ELLIPSE: "ellipse",
    ARROW: "arrow",
    PAN_ZOOM: "pan_zoom"
}

export const DEBOUNCE_DELAY = 2000;
export const COLORS = ['transparent', '#ffffff', '#f1f5f9', '#fca5a5', '#fcd34d', '#86efac', '#93c5fd', '#c4b5fd', '#cbd5e1', '#334155'];