import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "../store/editor-store";
import { localStorageDriver, backendApiDriver } from "../utils/storage";
import type { CanvasData } from "../utils/storage";
import type { AppNode, CustomEdge } from "../types";

const AUTO_SAVE_DEBOUNCE_MS = 2000; // save after every 2sec if somthing change

export function useCanvasPersistence(canvasId: string = "default-canvas") {
  const nodes = useEditorStore((s) => s.nodes);
  const edges = useEditorStore((s) => s.edges);
  const initializeCanvasData = useEditorStore((s) => s.initializeCanvasData);

  const [isInitialized, setIsInitialized] = useState(false);
  const isHydrating = useRef(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        
        const data = await localStorageDriver.getCanvas(canvasId);
        
        if (mounted && data) {
          initializeCanvasData(data.nodes || [], data.edges || []);
        }

        // in future
        // const backendData = await backendApiDriver.getCanvas(canvasId);

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
  }, [canvasId, initializeCanvasData]);


  useEffect(() => {
    // Avoid saving empty/default state before initial elements restoration from localstorage/db finishes
    if (isHydrating.current) return;

    // Clean transient UI states (like dragging/selection/measurements) before saving
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
      
      // Layer A: Fast offline-capable local persistence
      localStorageDriver.saveCanvas(canvasId, stateToSave).catch(console.error);

      // Layer B: Background debounced remote API persistence
      backendApiDriver.saveCanvas(canvasId, stateToSave).catch(console.error);

    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, canvasId]);

  return { isInitialized };
}
