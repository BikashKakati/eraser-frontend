import {
  ConnectionMode,
  ReactFlow,
  SelectionMode,
} from "@xyflow/react";

import { sidebarTools } from "../../constant";
import { useEditorStore } from "../../store/editor-store";

import ConnectionLine from "../connection-line/ConnectionLine";
import ConnectableArrow from "../custom-edges/connectable-arrow/ConnectableArrow";
import AnchorNode from "../custom-nodes/AnchorNode";
import EllipseNode from "../custom-nodes/ellipse/EllipseNode";
import RectangleNode from "../custom-nodes/rectangle/RectangleNode";
import GroupNode from "../custom-nodes/group/GroupNode";
import ActionBar from "../action-bar/ActionBar";
import ZoomControls from "../zoom-controls/ZoomControls";

import { useCanvasInteractions } from "../../hooks/useCanvasInteractions";
import { useNodeChanges } from "../../hooks/useNodeChanges";
import { useCanvasPersistence } from "../../hooks/useCanvasPersistence";

const nodeTypes = {
  rectangle: RectangleNode,
  ellipse: EllipseNode,
  anchor: AnchorNode,
  customGroup: GroupNode,
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

        panOnDrag={activeTool === sidebarTools.PAN_ZOOM}
        nodesDraggable={activeTool === sidebarTools.SELECT}
        selectionOnDrag={activeTool === sidebarTools.SELECT}
        selectionMode={SelectionMode.Partial}
        panOnScroll={true}
        minZoom={0.1}
        maxZoom={4.0}
      >
        <ZoomControls />
      </ReactFlow>
      <ActionBar />
    </>
  );
};

export default MainCanvas;