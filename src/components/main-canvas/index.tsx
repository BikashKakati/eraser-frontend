import { addEdge, MarkerType, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { CustomNodeComponent } from "./CustomNode";
import type { CustomEdgeType, CustomNodeType } from "../../types/custom-node-types";
import { useStore } from "../../store/zustand-store";
import { useCallback } from "react";
import type {Connection, OnConnect } from '@xyflow/react';

const nodeTypes = {
  custom: CustomNodeComponent,
};

const MainCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeType>([]);
  const { screenToFlowPosition } = useReactFlow();
  const { activeTool, setActiveTool } = useStore();

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      console.log('Connection made:', params); // Debug log
      const newEdge: CustomEdgeType = {
        ...params,
        id: `edge_${Date.now()}`,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: '#333' },
        style: { strokeWidth: 2, stroke: '#333' },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (activeTool !== 'rectangle' && activeTool !== 'circle') return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: CustomNodeType = {
        id: `node_${Date.now()}`,
        type: 'custom',
        position,
        width: activeTool === 'circle' ? 120 : 150,
        height: activeTool === 'circle' ? 120 : 100,
        data: { shape: activeTool },
      };

      setNodes((nds) => nds.concat(newNode));
      setActiveTool('select');
    },
    [activeTool, screenToFlowPosition, setNodes, setActiveTool]
  );

  // Control which interactions are enabled based on active tool
  const isDraggable = activeTool === 'select';
  const isConnectable = activeTool === 'arrow';
  const isPannable = activeTool === 'pan'; // Only allow panning in pan mode
  const isSelectable = activeTool === 'select';

  let paneCursorClass = 'cursor-default';
  if (activeTool === 'rectangle' || activeTool === 'circle') paneCursorClass = 'cursor-copy';
  else if (activeTool === 'arrow') paneCursorClass = 'cursor-crosshair';
  else if (activeTool === 'pan') paneCursorClass = 'cursor-grab active:cursor-grabbing';

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      
      // Control interactions based on active tool
      nodesDraggable={isDraggable}
      nodesConnectable={isConnectable}
      selectNodesOnDrag={isDraggable}
      elementsSelectable={isSelectable}
      
      // Disable panning except in pan mode
      panOnDrag={isPannable}
      panOnScroll={isPannable}
      zoomOnScroll={isPannable}
      zoomOnPinch={isPannable}
      zoomOnDoubleClick={isPannable}
      
      className={`bg-gray-50 ${paneCursorClass}`}
      deleteKeyCode={['Backspace', 'Delete']}
      fitView
    />
  );
};

export default MainCanvas;