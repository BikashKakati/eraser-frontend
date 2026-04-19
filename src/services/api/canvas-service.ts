import { apiClient } from "../../config/api-client";
import type { Node, Edge } from '@xyflow/react';
import { debounce } from '../../utils/debounce';

export interface CanvasData {
    nodes: Node[];
    edges: Edge[];
    updatedAt?: string | null;
}

class CanvasServiceClass {
    async getCanvasContent(flowId: string): Promise<CanvasData> {
        const response = await apiClient.get<{ success: boolean, message: string, data: CanvasData }>(`/flows/${flowId}/canvas`);
        return response.data.data;
    }

    async saveCanvasContent(flowId: string, nodes: Node[], edges: Edge[]): Promise<{ success: boolean, updatedAt: string }> {
        const response = await apiClient.post<{ success: boolean, message: string, data: { success: boolean, updatedAt: string } }>(`/flows/${flowId}/canvas`, { nodes, edges });
        return response.data.data;
    }

    // Debounced version of saveCanvasContent using our local generic debounce utility.
    // It creates a debounced function per flowId to avoid clashing.
    private debouncedSavers: Record<string, (...args: any[]) => void> = {};

    saveCanvasContentDebounced(flowId: string, nodes: Node[], edges: Edge[], delay: number = 6000): void {
        if (!this.debouncedSavers[flowId]) {
            this.debouncedSavers[flowId] = debounce(async (fId: string, n: Node[], e: Edge[]) => {
                try {
                    await this.saveCanvasContent(fId, n, e);
                } catch (error) {
                    console.error("Failed to cleanly save canvas via debouncer", error);
                }
            }, delay);
        }

        this.debouncedSavers[flowId](flowId, nodes, edges);
    }
}

export const CanvasService = new CanvasServiceClass();
