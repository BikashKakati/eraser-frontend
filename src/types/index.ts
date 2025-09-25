import type { Edge, Node } from '@xyflow/react';



export enum ShapeNodeType {
  rectangle = "rectangle",
  circle = "circle",
};

export type ShapeNodeData = {
  textContent?: string,
  bgColor?:string,
  borderColor?:string
}

export enum EdgeTypes {
  connectableArrow = "connectableArrow",
  anyPlaceArrow = "anyPlaceArrow",
}

export type EdgeData = {
  arrowColor?:string,
  arrowText?:string,
}

export type ShapeNode = Node<ShapeNodeData, ShapeNodeType>;
export type CustomEdge = Edge<EdgeData, EdgeTypes>;
