import { ShapeNodeType, type ShapeNode } from "../types";
import type { SidebarOption } from "../types/sidebar-types";

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


export const sidebarOptionList:SidebarOption[]=[
    {
        title: "Select",
        key:"select",
    },
    {
        title: "Rectangle",
        key:"rectangle",
    },
    {
        title: "Circle",
        key:"circle",
    },
    {
        title: "Arrow",
        key:"arrow",
    },
    {
        title: "Pan/Zoom",
        key:"pan_zoom",
    },
]