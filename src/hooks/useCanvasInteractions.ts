import { useCallback, useState, useEffect, type MouseEvent as ReactMouseEvent } from 'react';
import { useReactFlow, MarkerType } from '@xyflow/react';

import { useActiveToolStore } from '../store/zustand-store';
import { useCanvasStore } from '../store/canvas-store';

import { sidebarTools } from '../constant';
import { getUniqueId } from '../components/utils';
import { ShapeNodeType, EdgeTypes, type AnchorNodeType, type ShapeNode, type CustomEdge, type AppNode } from '../types';
import type { DrawingShape } from '../types/canvas-types';
import { calculateSnapTarget } from '../utils/snapping';

export function useCanvasInteractions() {
  const { activeTool, setActiveTool, drawingArrowFrom, setDrawingArrowFrom } = useActiveToolStore();
  const { setNodes, setEdges } = useCanvasStore();
  
  const { screenToFlowPosition } = useReactFlow();

  const [anchorNodeDetails, setAnchorNodeDetails] = useState<{ sourceNodeId: string, targetNodeId: string } | null>(null);

  // To store the details of the shape node being drawn after selecting from the sidebar
  const [drawingShapeDetails, setDrawingShapeDetails] = useState<DrawingShape | null>(null);

  // effect to listen for external drawing starts (like from a shape component border)
  useEffect(() => {
    if (drawingArrowFrom && !anchorNodeDetails) {
      const flowPosition = screenToFlowPosition({ x: drawingArrowFrom.x, y: drawingArrowFrom.y });

      const sourceNodeId = `anchor-${getUniqueId()}`;
      const targetNodeId = `anchor-${getUniqueId()}`;

      const sourceNode: AnchorNodeType = {
        id: sourceNodeId,
        type: "anchor",
        position: drawingArrowFrom.parentId && drawingArrowFrom.relativeX !== undefined && drawingArrowFrom.relativeY !== undefined
          ? { x: drawingArrowFrom.relativeX, y: drawingArrowFrom.relativeY }
          : flowPosition,
        parentId: drawingArrowFrom.parentId,
        data: { identityType: "source", handlePosition: drawingArrowFrom.handlePosition },
        draggable: false,
        selectable: false,
        zIndex: 2000,
      };

      const targetNode: AnchorNodeType = {
        id: targetNodeId,
        type: "anchor",
        position: flowPosition,
        data: { identityType: "target" },
        draggable: false,
        selectable: false,
        zIndex: 2000,
      };

      const previewEdge: CustomEdge = {
        id: `edge-${sourceNodeId}-${targetNodeId}`,
        source: sourceNodeId,
        target: targetNodeId,
        type: EdgeTypes.connectableArrow,
        markerEnd: { type: MarkerType.Arrow, width: 20, height: 20, color: '#000' },
      };

      setNodes((nds) => nds.concat([sourceNode, targetNode]));
      setEdges((eds) => eds.concat([previewEdge]));
      setAnchorNodeDetails({ sourceNodeId, targetNodeId });
    }
  }, [drawingArrowFrom, screenToFlowPosition, setNodes, setEdges, anchorNodeDetails]);

  // Handler to start drawing a free-floating arrow or rectangle
  const handleMouseDown = useCallback((event: ReactMouseEvent) => {
    if ((activeTool !== sidebarTools.RECTANGLE && activeTool !== sidebarTools.ELLIPSE && activeTool !== sidebarTools.ARROW) || event.button !== 0) return;
    event.preventDefault();

    const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });

    if (activeTool === sidebarTools.RECTANGLE || activeTool === sidebarTools.ELLIPSE) {
      const shapeType = activeTool === sidebarTools.RECTANGLE ? ShapeNodeType.rectangle : ShapeNodeType.ellipse;
      const prefix = activeTool === sidebarTools.RECTANGLE ? 'rect' : 'ellipse';
      const newShapeId = `${prefix}-${getUniqueId()}`;
      
      const newNode: ShapeNode = {
        id: newShapeId,
        type: shapeType,
        position: flowPosition,
        data: { content: { text: "" } },
        width: 0,
        height: 0,
        selected: true,
      };

      setNodes((nds) => nds.concat([newNode]));
      setDrawingShapeDetails({ id: newShapeId, startPosition: flowPosition });
      
    } else if (activeTool === sidebarTools.ARROW) {
      setDrawingArrowFrom({
        x: event.clientX,
        y: event.clientY,
      });
    }
  }, [activeTool, screenToFlowPosition, setNodes, setDrawingArrowFrom]);

  // Handle dragging states
  const handleMouseMove = useCallback((event: ReactMouseEvent) => {
    if (!anchorNodeDetails && !drawingShapeDetails) return;

    const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });

    if (anchorNodeDetails) {
      // Find what it snaps to
      // Zustand keeps notes of everything right now so we don't need `setNodes((current))` but we can use parameter for immutability updates
      setNodes((existingNodes) => {
        // Evaluate the new target via snapping
        const snapPoint = calculateSnapTarget(flowPosition, existingNodes);

        return existingNodes.map((node) => {
          if (node.id === anchorNodeDetails.targetNodeId) {
            return {
              ...node,
              position: { x: snapPoint.x, y: snapPoint.y },
              parentId: snapPoint.snappedParentId,
              data: {
                ...node.data,
                handlePosition: snapPoint.handlePosition,
              }
            } as AppNode;
          }
          return node as AppNode;
        });
      });
      
    } else if (drawingShapeDetails && (activeTool === sidebarTools.RECTANGLE || activeTool === sidebarTools.ELLIPSE)) {
      const { id, startPosition } = drawingShapeDetails;

      setNodes((existingNodes) =>
        existingNodes.map((node) => {
          if (node.id === id) {
            const width = Math.abs(flowPosition.x - startPosition!.x);
            const height = Math.abs(flowPosition.y - startPosition!.y);
            const position = {
              x: Math.min(flowPosition.x, startPosition!.x),
              y: Math.min(flowPosition.y, startPosition!.y)
            };
            return { ...node, position, width, height } as AppNode;
          }
          return node as AppNode;
        })
      );
    }
  }, [screenToFlowPosition, setNodes, anchorNodeDetails, drawingShapeDetails, activeTool]);


  const handleMouseUp = useCallback(() => {
    if (anchorNodeDetails) {
      const { sourceNodeId, targetNodeId } = anchorNodeDetails;

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === sourceNodeId || n.id === targetNodeId) {
            return { ...n, draggable: true, selectable: true };
          }
          return n;
        })
      );

      const edgeId = `edge-${sourceNodeId}-${targetNodeId}`;

      setEdges((existingEdges) => {
        return existingEdges.map(e => {
          if (e.id === edgeId) {
            return { ...e, selected: true };
          }
          return { ...e, selected: false };
        });
      });

      setAnchorNodeDetails(null);
      setDrawingArrowFrom(null);
      setActiveTool(sidebarTools.SELECT);
      
    } else if (drawingShapeDetails) {
      setDrawingShapeDetails(null);
      setActiveTool(sidebarTools.SELECT);
    }
  }, [anchorNodeDetails, setEdges, setNodes, drawingShapeDetails, setActiveTool, setDrawingArrowFrom]);


  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
