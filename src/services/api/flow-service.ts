import { apiClient } from "../../config/api-client";

export interface FlowMetadata {
  id: string;
  spaceId: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const FlowService = {
  getFlowsBySpace: async (spaceId: string): Promise<FlowMetadata[]> => {
    const response = await apiClient.get<{ success: boolean, message: string, data: FlowMetadata[] }>(`/spaces/${spaceId}/flows`);
    return response.data.data;
  },

  createFlow: async (spaceId: string, id: string, name: string): Promise<FlowMetadata> => {
    const response = await apiClient.post<{ success: boolean, message: string, data: FlowMetadata }>(`/spaces/${spaceId}/flows`, { id, name });
    return response.data.data;
  },

  updateFlowName: async (id: string, name: string): Promise<FlowMetadata> => {
    const response = await apiClient.put<{ success: boolean, message: string, data: FlowMetadata }>(`/flows/${id}/name`, { name });
    return response.data.data;
  },

  deleteFlow: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<{ success: boolean }>(`/flows/${id}`);
    return response.data.success;
  }
};
