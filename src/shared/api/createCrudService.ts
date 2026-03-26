import { apiClient } from "./client";
import type { CrudService } from "../types/resources";

function normalizePath(path: string) {
    return path
        .split("/")
        .filter(Boolean)
        .join("/");
}

export function createCrudService(path: string): CrudService {
    const resourcePath = `${normalizePath(path)}/`;

    return {
        list: async () => {
            const response = await apiClient.get(resourcePath);
            return response.data;
        },
        getById: async (id) => {
            const response = await apiClient.get(`${resourcePath}${id}/`);
            return response.data;
        },
        create: async (payload) => {
            const response = await apiClient.post(resourcePath, payload);
            return response.data;
        },
        update: async (id, payload) => {
            const response = await apiClient.put(`${resourcePath}${id}/`, payload);
            return response.data;
        },
        remove: async (id) => {
            const response = await apiClient.delete(`${resourcePath}${id}/`);
            return response.data;
        },
    };
}
