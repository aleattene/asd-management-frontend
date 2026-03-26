import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "../config/env";

export const AUTH_STORAGE_KEYS = {
    accessToken: "asd-management.auth.access-token",
    refreshToken: "asd-management.auth.refresh-token",
    username: "asd-management.auth.username",
} as const;

export function getStoredAccessToken() {
    if (typeof window === "undefined") {
        return "";
    }

    return window.sessionStorage.getItem(AUTH_STORAGE_KEYS.accessToken) ?? "";
}

export function getStoredRefreshToken() {
    if (typeof window === "undefined") {
        return "";
    }

    return window.sessionStorage.getItem(AUTH_STORAGE_KEYS.refreshToken) ?? "";
}

export function getStoredUsername() {
    if (typeof window === "undefined") {
        return "";
    }

    return window.sessionStorage.getItem(AUTH_STORAGE_KEYS.username) ?? "";
}

interface StoredTokens {
    accessToken?: string;
    refreshToken?: string;
}

export function setStoredTokens({ accessToken = "", refreshToken = "" }: StoredTokens) {
    if (typeof window === "undefined") {
        return;
    }

    if (accessToken) {
        window.sessionStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
    } else {
        window.sessionStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
    }

    if (refreshToken) {
        window.sessionStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
    } else {
        window.sessionStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
    }
}

export function setStoredUsername(username = "") {
    if (typeof window === "undefined") {
        return;
    }

    if (username) {
        window.sessionStorage.setItem(AUTH_STORAGE_KEYS.username, username);
    } else {
        window.sessionStorage.removeItem(AUTH_STORAGE_KEYS.username);
    }
}

export const apiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.baseURL = config.baseURL ?? getApiBaseUrl();

    const accessToken = getStoredAccessToken();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

interface ApiErrorPayload {
    detail?: string;
    message?: string;
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
    const apiError = error as AxiosError<ApiErrorPayload>;
    const apiMessage =
        apiError?.response?.data?.detail ??
        apiError?.response?.data?.message ??
        apiError?.message;

    return apiMessage || fallbackMessage;
}
