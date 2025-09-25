import type { Connection, NodeChange } from "@xyflow/react";
import {
  addEdge,
  ConnectionMode,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { tempNodes } from "../../constant";
import { EdgeTypes, type CustomEdge, type ShapeNode } from "../../types";
import CircleNode from "../custom-nodes/shape-nodes/circle/CircleNode";
import RectangleNode from "../custom-nodes/shape-nodes/rectangle/RectangleNode";
import ConnectableArrow from "../custom-edges/connectable-arrow/ConnectableArrow";
import { getUniqueId } from "../utils";
import ConnectionLine from "../connection-line/ConnectionLine";

const nodeTypes = {
  rectangle: RectangleNode,
  circle: CircleNode,
};

const edgeTypes = {
  connectableArrow: ConnectableArrow,
};

const MainCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<ShapeNode>(tempNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  // const { screenToFlowPosition, getNodes } = useReactFlow();

  function handlePanClick() { }

  function handleNodeChange(nodeChanges: NodeChange<ShapeNode>[]) {
    onNodesChange(nodeChanges);
  }

  function handleConnectNodes(connection: Connection) {
    const newEdge: CustomEdge = {
      ...connection,
      type: EdgeTypes.connectableArrow,
      animated: true,
      id: getUniqueId(),
      markerStart: {
        type: MarkerType.Arrow,
        width: 30,
        height: 30,
        color: "#000",
      },
    };
    setEdges((existingEdges) => addEdge(newEdge, existingEdges));
  }

  // function handleNodeClick(event: MouseEvent, nodeDetails: Node){
  // }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onConnect={handleConnectNodes}
      onPaneClick={handlePanClick}
      connectionMode={ConnectionMode.Loose}
      connectionLineComponent={ConnectionLine}
      onNodesChange={handleNodeChange}
    />
  );
};

export default MainCanvas;
