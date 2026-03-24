function normalizeBaseUrl(baseUrl) {
    return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

function normalizePath(path) {
    return path
        .split("/")
        .filter(Boolean)
        .join("/");
}

export const appEnv = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim()
        ? normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL.trim())
        : "",
    authLoginPath: import.meta.env.VITE_AUTH_LOGIN_PATH?.trim()
        ? normalizePath(import.meta.env.VITE_AUTH_LOGIN_PATH.trim())
        : "",
    enableMockAuth: import.meta.env.VITE_ENABLE_MOCK_AUTH === "true",
    applicationName: import.meta.env.VITE_APPLICATION_NAME?.trim() || "ASD Management",
    associationName: import.meta.env.VITE_ASSOCIATION_NAME?.trim() || "ASD Name",
    appTagline:
        import.meta.env.VITE_APP_TAGLINE?.trim() ||
        "Gestionale sportivo con accesso riservato.",
    supportEmail:
        import.meta.env.VITE_SUPPORT_EMAIL?.trim() || "supporto@asd-management.local",
};

export function getApiBaseUrl() {
    if (appEnv.apiBaseUrl) {
        return appEnv.apiBaseUrl;
    }

    throw new Error(
        "Missing VITE_API_BASE_URL. Configure it in the environment before calling the backend.",
    );
}

export function getAuthLoginPath() {
    if (appEnv.authLoginPath) {
        return appEnv.authLoginPath;
    }

    throw new Error(
        "Missing VITE_AUTH_LOGIN_PATH. Configure it in the environment before calling the JWT login endpoint.",
    );
}
