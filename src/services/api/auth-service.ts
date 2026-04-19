import { apiClient } from "../../config/api-client";

export interface User {
    id: string;
    email: string;
    name: string;
    profilePictureUrl?: string | null;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export const AuthService = {
    signup: async (email: string, password: string, name: string): Promise<AuthResponse> => {
        const response = await apiClient.post<{ success: boolean, message: string, data: AuthResponse }>('/auth/signup', { email, password, name });
        return response.data.data;
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await apiClient.post<{ success: boolean, message: string, data: AuthResponse }>('/auth/login', { email, password });
        return response.data.data;
    },

    getCurrentProfile: async (): Promise<User> => {
        const response = await apiClient.get<{ success: boolean, message: string, data: User }>('/users/me');
        return response.data.data;
    },

    updateProfile: async (name: string, profilePictureFile?: string): Promise<User> => {
        const payload: any = { name };
        if (profilePictureFile) {
            payload.profilePictureFile = profilePictureFile;
        }
        const response = await apiClient.put<{ success: boolean, message: string, data: User }>('/users/me/profile', payload);
        return response.data.data;
    }
}
