const DEFAULT_DEV_API_BASE_URL = "http://localhost:8000/api/v1";
const DEFAULT_AUTH_LOGIN_PATH = "auth/jwt/create";

function normalizeBaseUrl(baseUrl) {
    return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

function resolveApiBaseUrl() {
    const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

    if (configuredBaseUrl) {
        return normalizeBaseUrl(configuredBaseUrl);
    }

    if (import.meta.env.DEV) {
        return normalizeBaseUrl(DEFAULT_DEV_API_BASE_URL);
    }

    return "";
}

function normalizePath(path) {
    return path
        .split("/")
        .filter(Boolean)
        .join("/");
}

export const appEnv = {
    apiBaseUrl: resolveApiBaseUrl(),
    authLoginPath:
        normalizePath(import.meta.env.VITE_AUTH_LOGIN_PATH?.trim() ?? DEFAULT_AUTH_LOGIN_PATH),
    enableMockAuth:
        import.meta.env.VITE_ENABLE_MOCK_AUTH === "true" || import.meta.env.DEV,
};

export function getApiBaseUrl() {
    if (appEnv.apiBaseUrl) {
        return appEnv.apiBaseUrl;
    }

    throw new Error(
        "Missing VITE_API_BASE_URL. Configure it in the environment before calling the backend.",
    );
}
