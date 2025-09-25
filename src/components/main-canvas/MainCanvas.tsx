import type {
  Connection,
  NodeChange
} from "@xyflow/react";
import {
  addEdge,
  ReactFlow,
  useEdgesState,
  useNodesState
} from "@xyflow/react";
import { tempNodes } from "../../constant";
import {
  EdgeTypes,
  type CustomEdge,
  type ShapeNode
} from "../../types";
import CircleNode from "../custom-nodes/shape-nodes/circle/CircleNode";
import RectangleNode from "../custom-nodes/shape-nodes/rectangle/RectangleNode";
import ConnectableArrow from "../custom-edges/connectable-arrow/ConnectableArrow";
import { getUniqueId } from "../utils";


const nodeTypes = {  
  rectangle: RectangleNode,
  circle: CircleNode
};

const edgeTypes = {
  connectableArrow: ConnectableArrow
}



const MainCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<ShapeNode>(tempNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  // const { screenToFlowPosition, getNodes } = useReactFlow();

  function handlePanClick(){

  }

  function handleNodeChange(nodeChanges: NodeChange<ShapeNode>[]){
    onNodesChange(nodeChanges);
  }

  function handleConnectNodes(connection: Connection){
    const newEdge: CustomEdge = {...connection, type:EdgeTypes.connectableArrow, animated:true, id: getUniqueId()};
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
      onNodesChange={handleNodeChange}
      />
  );
};

export default MainCanvas;