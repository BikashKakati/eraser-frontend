import type { Edge, Node } from '@xyflow/react';

// Define the shape of our node data. Extend Record so it satisfies the library constraint.
// export interface CustomNodeData extends Record<string, unknown> {
//   shape: "rectangle" | "circle";
//   width: number;
//   height: number;
// }
export type CustomNodeData = {
  shape: 'rectangle' | 'circle';
};

export type CustomNodeType = Node<CustomNodeData, 'custom'>;
export type CustomEdgeType = Edge;
