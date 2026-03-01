import type { Edge, Node, Position } from '@xyflow/react';



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

export type AnchorData = {text?:string, identityType:"source"|"target", isVisible?: boolean, handlePosition?: Position}

export type ShapeNode = Node<ShapeNodeData, ShapeNodeType>;
export type AnchorNodeType = Node<AnchorData, "anchor">;
export type AppNode =
|AnchorNodeType
|ShapeNode
export type CustomEdge = Edge<EdgeData, EdgeTypes>;
