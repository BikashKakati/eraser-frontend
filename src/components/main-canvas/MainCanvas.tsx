import {
  ConnectionMode,
  ReactFlow,
} from "@xyflow/react";

import { sidebarTools } from "../../constant";
import { useEditorStore } from "../../store/editor-store";

import ConnectionLine from "../connection-line/ConnectionLine";
import ConnectableArrow from "../custom-edges/connectable-arrow/ConnectableArrow";
import AnchorNode from "../custom-nodes/AnchorNode";
import EllipseNode from "../custom-nodes/ellipse/EllipseNode";
import RectangleNode from "../custom-nodes/rectangle/RectangleNode";
import ActionBar from "../action-bar/ActionBar";

import { useCanvasInteractions } from "../../hooks/useCanvasInteractions";
import { useNodeChanges } from "../../hooks/useNodeChanges";
import { useCanvasPersistence } from "../../hooks/useCanvasPersistence";

const nodeTypes = {
  rectangle: RectangleNode,
  ellipse: EllipseNode,
  anchor: AnchorNode,
};

const edgeTypes = {
  connectableArrow: ConnectableArrow,
};

const MainCanvas: React.FC = () => {
  const { activeTool, nodes, edges, onEdgesChange, onConnect } = useEditorStore();

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasInteractions();
  const { handleNodeChange } = useNodeChanges();

  useCanvasPersistence("default-canvas");

  return (
    <>
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

        panOnDrag={activeTool === sidebarTools.SELECT || activeTool === sidebarTools.PAN_ZOOM}
        nodesDraggable={activeTool === sidebarTools.SELECT}
      />
      <ActionBar />
    </>
  );
};

export default MainCanvas;