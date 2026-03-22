import type { AppNode, CustomEdge } from '../../types';
import { applyNodeChanges, applyEdgeChanges, addEdge, type NodeChange, type EdgeChange, type Connection } from '@xyflow/react';
import type { EditorStoreType } from '../../types/store-types';
import { calculateSnapTarget } from '../../utils/snapping';

export const initializeCanvasDataAction = (
  _state: EditorStoreType,
  nodes: AppNode[],
  edges: CustomEdge[]
): Partial<EditorStoreType> => {
  return { nodes, edges };
};

export const updateShapeNodeAction = (
  state: EditorStoreType,
  id: string,
  updates: { text?: string; width?: number; height?: number }
): Partial<EditorStoreType> => {
  const newNodes = state.nodes.map((node) => {
    if (node.id === id) {
      if (node.type === 'rectangle' || node.type === 'ellipse') {
        let newData = node.data;
        if (updates.text !== undefined) {
          newData = { ...newData, content: { ...(newData.content || {}), text: updates.text } };
        }
        return {
          ...node,
          data: newData,
          ...(updates.width !== undefined ? { width: updates.width } : {}),
          ...(updates.height !== undefined ? { height: updates.height } : {})
        } as AppNode;
      }
    }
    return node;
  });
  return { nodes: newNodes };
};

export const onNodesChangeAction = (
  state: EditorStoreType,
  changes: NodeChange<AppNode>[]
): Partial<EditorStoreType> => {
  return { nodes: applyNodeChanges(changes, state.nodes) as AppNode[] };
};

export const onEdgesChangeAction = (
  state: EditorStoreType,
  changes: EdgeChange<CustomEdge>[]
): Partial<EditorStoreType> => {
  return { edges: applyEdgeChanges(changes, state.edges) as CustomEdge[] };
};

export const onConnectAction = (
  state: EditorStoreType,
  connection: Connection
): Partial<EditorStoreType> => {
  return { edges: addEdge(connection, state.edges) as CustomEdge[] };
};




export const updateAnchorPositionsAction = (
  state: EditorStoreType, 
  nodeChanges: NodeChange<AppNode>[],
  anchorPositionChanges: NodeChange<AppNode>[]
): Partial<EditorStoreType> | null => {
  const nextNodes = applyNodeChanges(nodeChanges, state.nodes) as AppNode[];

  const newNodes = nextNodes.map((node) => {
    const change = anchorPositionChanges.find((c) => c.type === 'position' && c.id === node.id);
    if (change && change.type === 'position' && node.type === 'anchor') {
      let absPos = change.positionAbsolute;
      if (!absPos) {
        absPos = node.position;
        if (node.parentId) {
          const parentNode = state.nodes.find((n) => n.id === node.parentId);
          if (parentNode && parentNode.position) {
            absPos = {
              x: node.position.x + parentNode.position.x,
              y: node.position.y + parentNode.position.y,
            };
          }
        }
      }

      const snapPoint = calculateSnapTarget(absPos, state.nodes);

      return {
        ...node,
        position: { x: snapPoint.x, y: snapPoint.y },
        parentId: snapPoint.snappedParentId,
        data: {
          ...node.data,
          handlePosition: snapPoint.handlePosition,
        },
      } as AppNode;
    }
    return node;
  });

  return { nodes: newNodes };
};

