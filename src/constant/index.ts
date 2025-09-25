import { ShapeNodeType, type ShapeNode } from "../types";

export const tempNodes: ShapeNode[] = [
    {
        id: "temp1a",
        position: {x: 300, y: 200},
        type: ShapeNodeType.rectangle,
        data:{textContent:"rec-1"},
        width: 300,
        height: 250,
    },
    {
        id: "temp2a",
        position: {x: 800, y: 200},
        type: ShapeNodeType.rectangle,
        data:{textContent:"rec-2"},
        width: 300,
        height: 250,
    },
    {
        id: "temp3a",
        position: {x: 1200, y: 200},
        type: ShapeNodeType.circle,
        data:{textContent:"cir-5"},
        width: 240,
        height: 240,
    }
]