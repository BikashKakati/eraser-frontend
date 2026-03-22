import { useEffect, useRef, useState } from "react";
import { useCanvasStore } from "../store/canvas-store";
import { localStorageDriver, backendApiDriver } from "../utils/storage";
import type { CanvasData } from "../utils/storage";
import type { AppNode, CustomEdge } from "../types";

const AUTO_SAVE_DEBOUNCE_MS = 1000;

export function useCanvasPersistence(canvasId: string = "default-canvas") {
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const setNodes = useCanvasStore((s) => s.setNodes);
  const setEdges = useCanvasStore((s) => s.setEdges);

  const [isInitialized, setIsInitialized] = useState(false);
  const isHydrating = useRef(true);

  // 1. Initial State Loading
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        // Attempt to restore canvas state from local storage first for instant feedback
        const data = await localStorageDriver.getCanvas(canvasId);
        
        if (mounted && data) {
          if (data.nodes && data.nodes.length > 0) setNodes(data.nodes);
          if (data.edges && data.edges.length > 0) setEdges(data.edges);
        }

        // Feature placeholder: Restore from backend if desired, merging or overriding local state
        // const backendData = await backendApiDriver.getCanvas(canvasId);
        // if (mounted && backendData) { ... }

      } catch (err) {
        console.error("Failed to restore canvas state:", err);
      } finally {
        if (mounted) {
          isHydrating.current = false;
          setIsInitialized(true);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [canvasId, setNodes, setEdges]);

  // 2. Debounced Save on State Changes
  useEffect(() => {
    // Avoid saving empty/default state before initial hydration finishes
    if (isHydrating.current) return;

    // Clean transient UI states (like drag/selection/measurements) before serializing
    const cleanNodes: AppNode[] = nodes.map((node) => {
      const { selected, dragging, measured, positionAbsolute, ...restAppNode } = node as any;
      return restAppNode as AppNode;
    });

    const cleanEdges: CustomEdge[] = edges.map((edge) => {
      const { selected, ...restEdge } = edge as any;
      return restEdge as CustomEdge;
    });

    const timeoutId = setTimeout(() => {
      const stateToSave: CanvasData = { nodes: cleanNodes, edges: cleanEdges };

      // Architecture rule: Dual-layer persistence abstraction.
      
      // Layer A: Fast offline-capable local persistence
      localStorageDriver.saveCanvas(canvasId, stateToSave).catch(console.error);

      // Layer B: Background debounced remote API persistence
      backendApiDriver.saveCanvas(canvasId, stateToSave).catch(console.error);

    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, canvasId]);

  return { isInitialized };
}
