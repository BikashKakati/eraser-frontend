import { type ShapeNode } from "../types";
import type { SidebarOption, SidebarTools } from "../types/sidebar-types";

export const tempNodes: ShapeNode[] = [
    // {
    //     id: "temp1a",
    //     position: {x: 300, y: 200},
    //     type: ShapeNodeType.rectangle,
    //     data:{textContent:"rec-1"},
    //     width: 300,
    //     height: 250,
    // },
    // {
    //     id: "temp2a",
    //     position: {x: 800, y: 200},
    //     type: ShapeNodeType.rectangle,
    //     data:{textContent:"rec-2"},
    //     width: 300,
    //     height: 250,
    // },
]

export const sidebarTools: SidebarTools= {
    SELECT:"select",
    RECTANGLE: "rectangle",
    CIRCLE:"circle",
    ARROW:"arrow",
    PAN_ZOOM:"pan_zoom"
}

export const sidebarOptionList:SidebarOption[]=[
    {
        title: "Select",
        key:sidebarTools.SELECT,
    },
    {
        title: "Rectangle",
        key: sidebarTools.RECTANGLE,
    },
    {
        title: "Circle",
        key: sidebarTools.CIRCLE,
    },
    {
        title: "Arrow",
        key: sidebarTools.ARROW,
    },
    {
        title: "Pan/Zoom",
        key:sidebarTools.PAN_ZOOM,
    },
]