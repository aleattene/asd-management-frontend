const DEFAULT_DEV_API_BASE_URL = "http://localhost:8000/api/v1";

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

    throw new Error(
        "Missing VITE_API_BASE_URL. Configure it in the environment before building this app.",
    );
}

export const appEnv = {
    apiBaseUrl: resolveApiBaseUrl(),
};
