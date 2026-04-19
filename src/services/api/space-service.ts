import { apiClient } from "../../config/api-client";

export interface Space {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const SpaceService = {
  getSpaces: async (): Promise<Space[]> => {
    const response = await apiClient.get<{ success: boolean, message: string, data: Space[] }>('/spaces');
    return response.data.data;
  },

  createSpace: async (id: string, name: string): Promise<Space> => {
    const response = await apiClient.post<{ success: boolean, message: string, data: Space }>('/spaces', { id, name });
    return response.data.data;
  },

  updateSpace: async (id: string, newName: string): Promise<Space> => {
    const response = await apiClient.put<{ success: boolean, message: string, data: Space }>(`/spaces/${id}`, { name: newName });
    return response.data.data;
  },

  deleteSpace: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<{ success: boolean }>(`/spaces/${id}`);
    return response.data.success;
  }
};
