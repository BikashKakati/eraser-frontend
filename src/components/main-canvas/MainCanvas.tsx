import {
  addEdge,
  ConnectionMode,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type NodeChange
} from "@xyflow/react";

import {
  useCallback,
  useState,
  type MouseEvent as ReactMouseEvent
} from "react";


import { tempNodes } from "../../constant";
import { useActiveToolStore } from "../../store/zustand-store";
import { EdgeTypes, ShapeNodeType, type AnchorNodeType, type AppNode, type CustomEdge, type ShapeNode } from "../../types";
import ConnectionLine from "../connection-line/ConnectionLine";
import ConnectableArrow from "../custom-edges/connectable-arrow/ConnectableArrow";
import AnchorNode from "../custom-nodes/AnchorNode";
import CircleNode from "../custom-nodes/circle/CircleNode";
import RectangleNode from "../custom-nodes/rectangle/RectangleNode";
import { getUniqueId } from "../utils";


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
  const { activeTool, setActiveTool } = useActiveToolStore();
  console.log(activeTool);

  const { screenToFlowPosition } = useReactFlow<AppNode, CustomEdge>();

  console.log(nodes);
  console.log(edges);

  const [anchorNodeDetails, setAnchorNodeDetails] = useState<{ sourceNodeId: string, targetNodeId: string } | null>(null);
  const [drawingShapeId, setDrawingShapeId] = useState<string | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);

  function handleNodeChange(nodeChanges: NodeChange<AppNode>[]) {
    if (activeTool === "arrow") {
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

  // Handler to start drawing a free-floating arrow or rectangle
  const handleMouseDown = useCallback(
    (event: ReactMouseEvent) => {
      if ((activeTool !== 'arrow' && activeTool !== 'rectangle') || event.button !== 0) return;

      event.preventDefault();

      const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      if (activeTool === 'arrow') {
        const sourceNodeId = `anchor-${getUniqueId()}`;
        const targetNodeId = `anchor-${getUniqueId()}`;

        const sourceNode: AnchorNodeType = {
          id: sourceNodeId,
          type: "anchor",
          position: flowPosition,
          data: { identityType: "source" },
          draggable: false,
          selectable: false,
        };

        const targetNode: AnchorNodeType = {
          id: targetNodeId,
          type: "anchor",
          position: flowPosition,
          data: { identityType: "target" },
          draggable: false,
          selectable: false,
        };

        setNodes((nds) => nds.concat([sourceNode, targetNode]));
        setAnchorNodeDetails({ sourceNodeId, targetNodeId });
      } else if (activeTool === 'rectangle') {
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
        setDrawingShapeId(newShapeId);
        setStartPoint(flowPosition);
      }

    }, [activeTool, screenToFlowPosition, setNodes]
  );

  const handleMouseMove = useCallback(
    (event: ReactMouseEvent) => {
      if (!anchorNodeDetails && !drawingShapeId) return;

      const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      if (anchorNodeDetails) {
        setNodes((existingNodes) =>
          existingNodes.map((node) => {
            if (node.id === anchorNodeDetails.targetNodeId) {
              return { ...node, position: flowPosition };
            }
            return node;
          })
        );
      } else if (drawingShapeId && startPoint && activeTool === 'rectangle') {
        setNodes((existingNodes) =>
          existingNodes.map((node) => {
            if (node.id === drawingShapeId) {
              const width = Math.abs(flowPosition.x - startPoint.x);
              const height = Math.abs(flowPosition.y - startPoint.y);
              const position = {
                x: Math.min(flowPosition.x, startPoint.x),
                y: Math.min(flowPosition.y, startPoint.y)
              };
              return { ...node, position, width, height };
            }
            return node;
          })
        );
      }
    }, [screenToFlowPosition, setNodes, anchorNodeDetails, drawingShapeId, startPoint, activeTool]
  );

  // Handler to finalize the arrow or rectangle drawing
  const handleMouseUp = useCallback(() => {
    if (anchorNodeDetails) {
      const { sourceNodeId, targetNodeId } = anchorNodeDetails;

      const newEdge: CustomEdge = {
        id: `edge-${sourceNodeId}-${targetNodeId}`,
        source: sourceNodeId,
        target: targetNodeId,
        type: EdgeTypes.connectableArrow,
        markerEnd: { type: MarkerType.Arrow, width: 20, height: 20, color: '#000' },
      };

      setEdges((existingEdges) => addEdge(newEdge, existingEdges));
      setAnchorNodeDetails(null);
    } else if (drawingShapeId) {
      setDrawingShapeId(null);
      setStartPoint(null);
      setActiveTool('select');
    }

  }, [anchorNodeDetails, setEdges, drawingShapeId, setActiveTool]);


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
      panOnDrag={activeTool === 'select' || activeTool === 'pan_zoom'}

      // Prevents nodes from being dragged when a drawing tool is active
      nodesDraggable={activeTool === 'select'}
    />
  );
};

export default MainCanvas;