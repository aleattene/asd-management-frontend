import axios from "axios";
import { getApiBaseUrl } from "../config/env";

export const AUTH_STORAGE_KEYS = {
    accessToken: "asd-management.auth.access-token",
    refreshToken: "asd-management.auth.refresh-token",
    username: "asd-management.auth.username",
};

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

export function setStoredTokens({ accessToken = "", refreshToken = "" }) {
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

apiClient.interceptors.request.use((config) => {
    config.baseURL = config.baseURL ?? getApiBaseUrl();

    const accessToken = getStoredAccessToken();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export function getErrorMessage(error, fallbackMessage) {
    const apiMessage =
        error?.response?.data?.detail ??
        error?.response?.data?.message ??
        error?.message;

    return apiMessage || fallbackMessage;
}
