import {
  addEdge, // Import this
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

// Import your updated types and new AnchorNode
import { tempNodes } from "../../constant";
import { useActiveToolStore } from "../../store/zustand-store";
import { EdgeTypes, type AnchorNodeType, type AppNode, type CustomEdge } from "../../types";
import ConnectionLine from "../connection-line/ConnectionLine";
import ConnectableArrow from "../custom-edges/connectable-arrow/ConnectableArrow";
import AnchorNode from "../custom-nodes/AnchorNode";
import CircleNode from "../custom-nodes/shape-nodes/circle/CircleNode";
import RectangleNode from "../custom-nodes/shape-nodes/rectangle/RectangleNode";
import { getUniqueId } from "../utils";

// Add the new AnchorNode to your node types
const nodeTypes = {
  rectangle: RectangleNode,
  circle: CircleNode,
  anchor: AnchorNode, // Add this
};

const edgeTypes = {
  connectableArrow: ConnectableArrow,
};

const MainCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(tempNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  const { activeTool } = useActiveToolStore();

  const { screenToFlowPosition } = useReactFlow<AppNode, CustomEdge>();

  console.log(nodes);
  console.log(edges);

  const [anchorNodeDetails, setAnchorNodeDetails] = useState<{ sourceNodeId: string, targetNodeId: string } | null>(null)

  function handleNodeChange(nodeChanges: NodeChange<AppNode>[]) {
    // Your existing logic to prevent moving nodes
    if (activeTool === "arrow") {
      return;
    }
    onNodesChange(nodeChanges);
  }

  // This handles connections between existing nodes' handles
  function handleConnectNodes(connection: Connection) {
    const newEdge: CustomEdge = {
      ...connection,
      id: getUniqueId(),
      type: EdgeTypes.connectableArrow,
      markerEnd: { type: MarkerType.Arrow, width: 20, height: 20, color: "#000" },
    };
    setEdges((existingEdges) => addEdge(newEdge, existingEdges));
  }

  // Handler to start drawing a free-floating arrow
  const handleMouseDown = useCallback(
    (event: ReactMouseEvent) => {
      if (activeTool !== 'arrow' || event.button !== 0) return;

      event.preventDefault();

      const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      const sourceNodeId = `anchor-${getUniqueId()}`;
      const targetNodeId = `anchor-${getUniqueId()}`;

      const sourceNode: AnchorNodeType = {
        id: sourceNodeId,
        type: "anchor",
        position: flowPosition,
        data: {identityType:"source"},
        draggable: false,
        selectable: false,
      };

      const targetNode: AnchorNodeType = {
        id: targetNodeId,
        type: "anchor",
        position: flowPosition,
        data: {identityType:"target"},
        draggable: false,
        selectable: false,
      };

      setNodes((nds) => nds.concat([sourceNode, targetNode]));
      setAnchorNodeDetails({ sourceNodeId, targetNodeId });

    }, [activeTool, screenToFlowPosition, setNodes]
  );

  // Handler to update the arrow's end point while drawing
  const handleMouseMove = useCallback(
    (event: ReactMouseEvent) => {
      if (!anchorNodeDetails) return;

      const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      setNodes((existingNodes) =>
        existingNodes.map((node) => {
          if (node.id === anchorNodeDetails.targetNodeId) {
            console.log(node);
            return { ...node, position: flowPosition };
          }
          return node;
        })
      );
    }, [screenToFlowPosition, setNodes, anchorNodeDetails]
  );

  // Handler to finalize the arrow drawing
  const handleMouseUp = useCallback(() => {
    if(!anchorNodeDetails) return;
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

  }, [anchorNodeDetails, setEdges]);


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
      // Add the new mouse event handlers
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      // Add a class to the pane when the arrow tool is active
      className={activeTool === 'arrow' ? 'arrow-tool-active' : ''}

      // Prevents the canvas from panning when the arrow tool is active
      panOnDrag={activeTool !== 'arrow'}

      // Prevents nodes from being dragged when the arrow tool is active
      nodesDraggable={activeTool !== 'arrow'}
    />
  );
};

export default MainCanvas;