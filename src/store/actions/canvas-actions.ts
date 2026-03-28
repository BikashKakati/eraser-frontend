import type { AppNode, CustomEdge } from '../../types';
import { applyNodeChanges, applyEdgeChanges, addEdge, MarkerType, type NodeChange, type EdgeChange, type Connection } from '@xyflow/react';
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
  updates: { text?: string; width?: number; height?: number; bgColor?: string; borderColor?: string; }
): Partial<EditorStoreType> => {
  const newNodes = state.nodes.map((node) => {
    if (node.id === id) {
      if (node.type === 'rectangle' || node.type === 'ellipse') {
        let newData = { ...node.data };
        if (updates.text !== undefined) {
          newData = { ...newData, content: { ...(newData.content || {}), text: updates.text } };
        }
        if (updates.bgColor !== undefined) {
          newData.bgColor = updates.bgColor;
        }
        if (updates.borderColor !== undefined) {
          newData.borderColor = updates.borderColor;
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

export const updateEdgeStyleAction = (
  state: EditorStoreType,
  id: string,
  updates: { arrowColor?: string; }
): Partial<EditorStoreType> => {
  const newEdges = state.edges.map(edge => {
    if (edge.id === id) {
      const newEdge = { ...edge, data: { ...edge.data, arrowColor: updates.arrowColor } } as CustomEdge;
      if (updates.arrowColor) {
        // Must update React Flow's native marker object to change the arrow head
        newEdge.markerEnd = { 
          ...(typeof edge.markerEnd === 'object' ? edge.markerEnd : {}), 
          type: MarkerType.Arrow,
          width: 20, height: 20,
          color: updates.arrowColor 
        };
      }
      return newEdge;
    }
    return edge;
  });
  return { edges: newEdges };
};

export const deleteElementsAction = (
  state: EditorStoreType,
  ids: string[],
  type: 'node' | 'edge'
): Partial<EditorStoreType> => {
  if (type === 'node') {
    const nextNodes = state.nodes.filter(n => !ids.includes(n.id));
    const selectedNodeIds = state.selectedNodeIds.filter(id => !ids.includes(id));
    // Also remove connected edges automatically? React Flow might handle this via `applyNodeChanges(remove)`, 
    // but a direct UI delete should either trigger `applyNodeChanges([{ type: 'remove', id }])` or we filter.
    // Let's rely on filtering just the targeted type, connected edges usually get pruned by React Flow 
    // when `onNodesDelete` is fired if configured, or we can handle it.
    return { nodes: nextNodes, selectedNodeIds };
  } else {
    const nextEdges = state.edges.filter(e => !ids.includes(e.id));
    const selectedEdgeIds = state.selectedEdgeIds.filter(id => !ids.includes(id));
    return { edges: nextEdges, selectedEdgeIds };
  }
};

export const onNodesChangeAction = (
  state: EditorStoreType,
  changes: NodeChange<AppNode>[]
): Partial<EditorStoreType> => {
  const nextNodes = applyNodeChanges(changes, state.nodes) as AppNode[];
  const selectedNodeIds = nextNodes.filter(n => n.selected).map(n => n.id);
  return { nodes: nextNodes, selectedNodeIds };
};

export const onEdgesChangeAction = (
  state: EditorStoreType,
  changes: EdgeChange<CustomEdge>[]
): Partial<EditorStoreType> => {
  const nextEdges = applyEdgeChanges(changes, state.edges) as CustomEdge[];
  const selectedEdgeIds = nextEdges.filter(e => e.selected).map(e => e.id);
  return { edges: nextEdges, selectedEdgeIds };
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

