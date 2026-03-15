import {
  ConnectionMode,
  ReactFlow,
} from "@xyflow/react";

import { sidebarTools } from "../../constant";
import { useActiveToolStore } from "../../store/zustand-store";
import { useCanvasStore } from "../../store/canvas-store";

import ConnectionLine from "../connection-line/ConnectionLine";
import ConnectableArrow from "../custom-edges/connectable-arrow/ConnectableArrow";
import AnchorNode from "../custom-nodes/AnchorNode";
import EllipseNode from "../custom-nodes/ellipse/EllipseNode";
import RectangleNode from "../custom-nodes/rectangle/RectangleNode";

import { useCanvasInteractions } from "../../hooks/useCanvasInteractions";
import { useNodeChanges } from "../../hooks/useNodeChanges";

const nodeTypes = {
  rectangle: RectangleNode,
  ellipse: EllipseNode,
  anchor: AnchorNode,
};

const edgeTypes = {
  connectableArrow: ConnectableArrow,
};

const MainCanvas: React.FC = () => {
  const { activeTool } = useActiveToolStore();
  const { nodes, edges, onEdgesChange, onConnect } = useCanvasStore();

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasInteractions();
  const { handleNodeChange } = useNodeChanges();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onConnect={onConnect}
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