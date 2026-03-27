import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";
import { getApiBaseUrl, getAuthRefreshPath } from "../config/env";

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

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface RefreshResponse {
    access?: string;
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        const refreshToken = getStoredRefreshToken();

        if (!refreshToken) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const refreshResponse = await axios.post<RefreshResponse>(
                getAuthRefreshPath(),
                { refresh: refreshToken },
                {
                    baseURL: getApiBaseUrl(),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const nextAccessToken = refreshResponse.data?.access ?? "";

            if (!nextAccessToken) {
                throw new Error("JWT refresh response missing access token.");
            }

            setStoredTokens({
                accessToken: nextAccessToken,
                refreshToken,
            });

            originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            setStoredTokens({ accessToken: "", refreshToken: "" });
            setStoredUsername("");
            return Promise.reject(refreshError);
        }
    },
);

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
