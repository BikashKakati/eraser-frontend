import type { Edge, Node, Position } from '@xyflow/react';



export enum ShapeNodeType {
  rectangle = "rectangle",
  ellipse = "ellipse",
};

export type ShapeNodeData = {
  content?: {
    text?: string;
    icon?: string;
    image?: string;
  };
  textContent?: string; // Kept temporarily for backwards compatibility if needed, but we will migrate
  bgColor?:string;
  borderColor?:string;
}

export enum EdgeTypes {
  connectableArrow = "connectableArrow",
  anyPlaceArrow = "anyPlaceArrow",
}

export type EdgeData = {
  arrowColor?:string,
  arrowText?:string,
}

export type AnchorData = {
  text?:string, 
  identityType:"source"|"target", 
  handlePosition?: Position
}

export type ShapeNode = Node<ShapeNodeData, ShapeNodeType>;
export type AnchorNodeType = Node<AnchorData, "anchor">;
export type AppNode =
|AnchorNodeType
|ShapeNode
export type CustomEdge = Edge<EdgeData, EdgeTypes>;


export interface EditableTextProps {
    initialText: string;
    onSave: (text: string) => void;
    onCancel?: () => void;
    isEditing: boolean;
    className?: string;
    style?: React.CSSProperties;
    onContentSizeChange?: (size: { width: number; height: number }) => void;
}
