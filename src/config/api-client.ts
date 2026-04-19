import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api`;

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('flowbit_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('flowbit_token');
            // Dispatch a custom event to notify the app to logout
            window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(error);
    }
);
