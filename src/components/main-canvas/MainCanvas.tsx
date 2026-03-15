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
import EllipseNode from "../custom-nodes/ellipse/EllipseNode";
import RectangleNode from "../custom-nodes/rectangle/RectangleNode";
import { getUniqueId } from "../utils";
import type { DrawingShape } from "../../types/canvas-types";


const nodeTypes = {
  rectangle: RectangleNode,
  ellipse: EllipseNode,
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

  const [anchorNodeDetails, setAnchorNodeDetails] = useState<{ sourceNodeId: string, targetNodeId: string } | null>(null);

  const [drawingShapeDetails, setDrawingShapeDetails] = useState<DrawingShape | null>(null);


  // To change the position of an already existing arrow by selecting the end anchor nodes, to detect sanp position for shape nodes
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

            for (const shapeNode of existingNodes) {
              if (shapeNode.type === ShapeNodeType.rectangle && shapeNode.position) {
                const localX = absPos.x - shapeNode.position.x;
                const localY = absPos.y - shapeNode.position.y;

                const margin = 8;
                const wrapperWidth = shapeNode.width ?? 336;
                const wrapperHeight = shapeNode.height ?? 208;

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
                    activeSnappedParentId = shapeNode.id;
                    break;
                  }
                }
              } else if (shapeNode.type === ShapeNodeType.ellipse && shapeNode.position) {
                const localX = absPos.x - shapeNode.position.x;
                const localY = absPos.y - shapeNode.position.y;

                const margin = 8;
                const wrapperWidth = shapeNode.width ?? 256;
                const wrapperHeight = shapeNode.height ?? 256;
                const nodeWidth = Math.max(0, wrapperWidth - margin * 2);
                const nodeHeight = Math.max(0, wrapperHeight - margin * 2);

                const cx = wrapperWidth / 2;
                const cy = wrapperHeight / 2;
                const rx = nodeWidth / 2;
                const ry = nodeHeight / 2;

                const dx = localX - cx;
                const dy = localY - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (localX >= -PADDING && localX <= wrapperWidth + PADDING && localY >= -PADDING && localY <= wrapperHeight + PADDING) {
                  const angle = Math.atan2(dy, dx);
                  const r_ellipse = (rx * ry) / Math.sqrt(Math.pow(ry * Math.cos(angle), 2) + Math.pow(rx * Math.sin(angle), 2));

                  if (Math.abs(dist - r_ellipse) <= PADDING) {
                    const snapX = cx + r_ellipse * Math.cos(angle);
                    const snapY = cy + r_ellipse * Math.sin(angle);

                    const deg = angle * 180 / Math.PI;
                    let targetHandlePos = Position.Right;
                    if (deg > 45 && deg <= 135) targetHandlePos = Position.Bottom;
                    else if (deg > 135 || deg <= -135) targetHandlePos = Position.Left;
                    else if (deg > -135 && deg <= -45) targetHandlePos = Position.Top;

                    targetPosition = { x: snapX, y: snapY };
                    activeTargetHandlePosition = targetHandlePos;
                    activeSnappedParentId = shapeNode.id;
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
        setDrawingShapeDetails({ id: newShapeId, startPosition: flowPosition })
      } else if (activeTool === sidebarTools.ARROW) {
        setDrawingArrowFrom({
          x: event.clientX,
          y: event.clientY,
        });
      }

    }, [activeTool, screenToFlowPosition, setNodes, setDrawingArrowFrom]
  );


  // Create arrows in arrow mode and calculate snap for shape nodes, because till now we didnot registered any anchor node just mouse is moving.
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
              const wrapperWidth = node.width ?? 336;
              const wrapperHeight = node.height ?? 208;

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
            } else if (node.type === ShapeNodeType.ellipse && node.position) {
              const margin = 8;
              const wrapperWidth = node.width ?? 256;
              const wrapperHeight = node.height ?? 256;
              const nodeWidth = Math.max(0, wrapperWidth - margin * 2);
              const nodeHeight = Math.max(0, wrapperHeight - margin * 2);

              const localX = targetPosition.x - node.position.x;
              const localY = targetPosition.y - node.position.y;

              const cx = wrapperWidth / 2;
              const cy = wrapperHeight / 2;
              const rx = nodeWidth / 2;
              const ry = nodeHeight / 2;
              const dx = localX - cx;
              const dy = localY - cy;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (localX >= -PADDING && localX <= wrapperWidth + PADDING && localY >= -PADDING && localY <= wrapperHeight + PADDING) {
                const angle = Math.atan2(dy, dx);
                const r_ellipse = (rx * ry) / Math.sqrt(Math.pow(ry * Math.cos(angle), 2) + Math.pow(rx * Math.sin(angle), 2));

                if (Math.abs(dist - r_ellipse) <= PADDING) {
                  const snapX = cx + r_ellipse * Math.cos(angle);
                  const snapY = cy + r_ellipse * Math.sin(angle);

                  let targetHandlePosition: Position = Position.Right;
                  const deg = angle * 180 / Math.PI;
                  if (deg > 45 && deg <= 135) targetHandlePosition = Position.Bottom;
                  else if (deg > 135 || deg <= -135) targetHandlePosition = Position.Left;
                  else if (deg > -135 && deg <= -45) targetHandlePosition = Position.Top;

                  targetPosition = { x: snapX, y: snapY };
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