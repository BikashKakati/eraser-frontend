import {
  addEdge,
  ConnectionMode,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  applyNodeChanges,
  Position,
  type Connection,
  type NodeChange
} from "@xyflow/react";

import {
  useCallback,
  useState,
  useEffect,
  type MouseEvent as ReactMouseEvent
} from "react";


import { sidebarTools, tempNodes } from "../../constant";
import { useActiveToolStore } from "../../store/zustand-store";
import { EdgeTypes, ShapeNodeType, type AnchorNodeType, type AppNode, type CustomEdge, type ShapeNode } from "../../types";
import ConnectionLine from "../connection-line/ConnectionLine";
import ConnectableArrow from "../custom-edges/connectable-arrow/ConnectableArrow";
import AnchorNode from "../custom-nodes/AnchorNode";
import CircleNode from "../custom-nodes/circle/CircleNode";
import RectangleNode from "../custom-nodes/rectangle/RectangleNode";
import { getUniqueId } from "../utils";
import type { DrawingShape } from "../../types/canvas-types";


const nodeTypes = {
  rectangle: RectangleNode,
  circle: CircleNode,
  anchor: AnchorNode,
};

const edgeTypes = {
  connectableArrow: ConnectableArrow,
};

const MainCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(tempNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  const { activeTool, setActiveTool, drawingArrowFrom, setDrawingArrowFrom } = useActiveToolStore();
  // console.log(activeTool);

  const { screenToFlowPosition } = useReactFlow<AppNode, CustomEdge>();

  // console.log(nodes);
  // console.log(edges);

  const [anchorNodeDetails, setAnchorNodeDetails] = useState<{ sourceNodeId: string, targetNodeId: string } | null>(null);

  const [drawingShapeDetails, setDrawingShapeDetails] = useState<DrawingShape | null>(null);

  // console.log("anchorNodeDetails", anchorNodeDetails);
  // console.log("drawingShapeId", drawingShapeId);
  // console.log("startPoint", startPoint);

  function handleNodeChange(nodeChanges: NodeChange<AppNode>[]) {
    if (activeTool === sidebarTools.ARROW) {
      return;
    }

    const anchorPositionChanges = nodeChanges.filter(c =>
      c.type === 'position' && nodes.find(n => n.id === (c as any).id)?.type === 'anchor'
    );

    if (anchorPositionChanges.length > 0) {
      setNodes((existingNodes) => {
        let nextNodes = applyNodeChanges(nodeChanges, existingNodes) as AppNode[];

        return nextNodes.map(node => {
          const change = anchorPositionChanges.find(c => (c as any).id === node.id);
          if (change && change.type === 'position' && node.type === 'anchor') {
            let absPos = change.positionAbsolute;

            // If dragging finished (no positionAbsolute), we must derive the actual absolute position reliably 
            // from the node's relative position and its parent.
            if (!absPos) {
              absPos = node.position;
              if (node.parentId) {
                const parentNode = existingNodes.find(n => n.id === node.parentId);
                if (parentNode && parentNode.position) {
                  absPos = {
                    x: node.position.x + parentNode.position.x,
                    y: node.position.y + parentNode.position.y
                  };
                }
              }
            }

            let targetPosition = absPos;
            let activeTargetHandlePosition: Position | undefined = undefined;
            let activeSnappedParentId: string | undefined = undefined;

            const PADDING = 20;

            for (const rectNode of existingNodes) {
              if (rectNode.type === ShapeNodeType.rectangle && rectNode.position) {
                const localX = absPos.x - rectNode.position.x;
                const localY = absPos.y - rectNode.position.y;

                const margin = 8;
                const nodeWidth = rectNode.width ?? 320;
                const nodeHeight = rectNode.height ?? 192;

                const wrapperWidth = nodeWidth + margin * 2;
                const wrapperHeight = nodeHeight + margin * 2;

                const leftMargin = margin;
                const rightMargin = wrapperWidth - margin;
                const topMargin = margin;
                const bottomMargin = wrapperHeight - margin;

                const inXBounds = localX >= -PADDING && localX <= wrapperWidth + PADDING;
                const inYBounds = localY >= -PADDING && localY <= wrapperHeight + PADDING;

                if (inXBounds && inYBounds) {
                  const distLeft = Math.abs(localX - leftMargin);
                  const distRight = Math.abs(localX - rightMargin);
                  const distTop = Math.abs(localY - topMargin);
                  const distBottom = Math.abs(localY - bottomMargin);

                  const minDist = Math.min(distLeft, distRight, distTop, distBottom);
                  if (minDist <= PADDING) {
                    let localSnappedX = localX;
                    let localSnappedY = localY;
                    let targetHandlePos = Position.Top;

                    if (minDist === distLeft) {
                      localSnappedX = leftMargin;
                      targetHandlePos = Position.Left;
                    } else if (minDist === distRight) {
                      localSnappedX = rightMargin;
                      targetHandlePos = Position.Right;
                    } else if (minDist === distTop) {
                      localSnappedY = topMargin;
                      targetHandlePos = Position.Top;
                    } else if (minDist === distBottom) {
                      localSnappedY = bottomMargin;
                      targetHandlePos = Position.Bottom;
                    }

                    targetPosition = { x: localSnappedX, y: localSnappedY };
                    activeTargetHandlePosition = targetHandlePos;
                    activeSnappedParentId = rectNode.id;
                    break;
                  }
                }
              }
            }

            return {
              ...node,
              position: targetPosition,
              parentId: activeSnappedParentId,
              data: {
                ...node.data,
                handlePosition: activeTargetHandlePosition
              }
            } as AppNode;
          }
          return node;
        });
      });
      return;
    }

    onNodesChange(nodeChanges);
  }

  function handleConnectNodes(connection: Connection) {
    const newEdge: CustomEdge = {
      ...connection,
      id: getUniqueId(),
      type: EdgeTypes.connectableArrow,
      markerEnd: { type: MarkerType.Arrow, width: 20, height: 20, color: "#000" },
    };
    setEdges((existingEdges) => addEdge(newEdge, existingEdges));
  }

  // Use effect to listen for external drawing starts (like from a rectangle border)
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
  const handleMouseDown = useCallback(
    (event: ReactMouseEvent) => {
      if ((activeTool !== sidebarTools.RECTANGLE) || event.button !== 0) return;

      event.preventDefault();

      const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      if (activeTool === sidebarTools.RECTANGLE) {
        const newShapeId = `rect-${getUniqueId()}`;
        const newNode: ShapeNode = {
          id: newShapeId,
          type: ShapeNodeType.rectangle,
          position: flowPosition,
          data: { textContent: "" },
          width: 0,
          height: 0,
          selected: true,
        };
        setNodes((nds) => nds.concat([newNode]));
        setDrawingShapeDetails({ id: newShapeId, startPosition: flowPosition })
      }

    }, [activeTool, screenToFlowPosition, setNodes]
  );

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent) => {
      if (!anchorNodeDetails && !drawingShapeDetails) return;

      const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      if (anchorNodeDetails) {
        setNodes((existingNodes) => {
          let targetPosition = flowPosition;
          let activeSnappedParentId: string | undefined = undefined;
          let activeTargetHandlePosition: Position | undefined = undefined;

          // Sticky logic: check if cursor is over any rectangle node borders
          const PADDING = 20; // snapping radius

          for (const node of existingNodes) {
            if (node.type === ShapeNodeType.rectangle && node.position) {
              const margin = 8;
              const nodeWidth = node.width ?? 320;
              const nodeHeight = node.height ?? 192;

              const wrapperWidth = nodeWidth + margin * 2;
              const wrapperHeight = nodeHeight + margin * 2;

              const localX = targetPosition.x - node.position.x;
              const localY = targetPosition.y - node.position.y;

              const leftMargin = margin;
              const rightMargin = wrapperWidth - margin;
              const topMargin = margin;
              const bottomMargin = wrapperHeight - margin;

              const inXBounds = localX >= -PADDING && localX <= wrapperWidth + PADDING;
              const inYBounds = localY >= -PADDING && localY <= wrapperHeight + PADDING;

              if (inXBounds && inYBounds) {
                const distLeft = Math.abs(localX - leftMargin);
                const distRight = Math.abs(localX - rightMargin);
                const distTop = Math.abs(localY - topMargin);
                const distBottom = Math.abs(localY - bottomMargin);

                const minDist = Math.min(distLeft, distRight, distTop, distBottom);
                if (minDist <= PADDING) {
                  let localSnappedX = localX;
                  let localSnappedY = localY;
                  let targetHandlePosition: Position = Position.Top;
                  if (minDist === distLeft) {
                    localSnappedX = leftMargin;
                    targetHandlePosition = Position.Left;
                  } else if (minDist === distRight) {
                    localSnappedX = rightMargin;
                    targetHandlePosition = Position.Right;
                  } else if (minDist === distTop) {
                    localSnappedY = topMargin;
                    targetHandlePosition = Position.Top;
                  } else if (minDist === distBottom) {
                    localSnappedY = bottomMargin;
                    targetHandlePosition = Position.Bottom;
                  }
                  targetPosition = { x: localSnappedX, y: localSnappedY };
                  activeSnappedParentId = node.id;
                  activeTargetHandlePosition = targetHandlePosition;
                  break;
                }
              }
            }
          }

          return existingNodes.map((node): AppNode => {
            if (node.id === anchorNodeDetails.targetNodeId) {
              return {
                ...node,
                position: targetPosition,
                parentId: activeSnappedParentId,
                data: {
                  ...node.data,
                  handlePosition: activeTargetHandlePosition
                }
              } as AppNode;
            }
            return node as AppNode;
          });
        });
      } else if (drawingShapeDetails && activeTool === sidebarTools.RECTANGLE) {
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
              return { ...node, position, width, height };
            }
            return node;
          })
        );
      }
    }, [screenToFlowPosition, setNodes, anchorNodeDetails, drawingShapeDetails, activeTool]
  );

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

      // Only active recently added arrow
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

  }, [anchorNodeDetails, setEdges, drawingShapeDetails, setActiveTool, setDrawingArrowFrom]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onConnect={handleConnectNodes}
      onNodesChange={handleNodeChange}
      onEdgesChange={onEdgesChange}
      connectionMode={ConnectionMode.Loose}
      connectionLineComponent={ConnectionLine}

      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}

      className={`tool-${activeTool}`}

      // Prevents the canvas from panning when a drawing tool is active
      panOnDrag={activeTool === sidebarTools.SELECT || activeTool === sidebarTools.PAN_ZOOM}

      // Prevents nodes from being dragged when a drawing tool is active
      nodesDraggable={activeTool === sidebarTools.SELECT}
    />
  );
};

export default MainCanvas;