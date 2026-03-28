import { describe, it, expect, vi, beforeEach } from "vitest";

async function importEnv() {
    vi.resetModules();
    return await import("./env");
}

describe("env", () => {
    beforeEach(() => {
        vi.unstubAllEnvs();
    });

    describe("appEnv defaults", () => {
        it("uses default application name when VITE_APP_NAME is empty", async () => {
            vi.stubEnv("VITE_APP_NAME", "");
            const { appEnv } = await importEnv();
            expect(appEnv.applicationName).toBe("ASD Management");
        });

        it("reads VITE_APP_NAME when set", async () => {
            vi.stubEnv("VITE_APP_NAME", "Custom Name");
            const { appEnv } = await importEnv();
            expect(appEnv.applicationName).toBe("Custom Name");
        });

        it("trims whitespace from VITE_APP_NAME", async () => {
            vi.stubEnv("VITE_APP_NAME", "  Spaced  ");
            const { appEnv } = await importEnv();
            expect(appEnv.applicationName).toBe("Spaced");
        });

        it("defaults enableMockAuth to false", async () => {
            vi.stubEnv("VITE_ENABLE_MOCK_AUTH", "");
            const { appEnv } = await importEnv();
            expect(appEnv.enableMockAuth).toBe(false);
        });

        it("enables mock auth only when value is exactly 'true'", async () => {
            vi.stubEnv("VITE_ENABLE_MOCK_AUTH", "true");
            const { appEnv } = await importEnv();
            expect(appEnv.enableMockAuth).toBe(true);
        });

        it("does not enable mock auth for truthy-like values", async () => {
            vi.stubEnv("VITE_ENABLE_MOCK_AUTH", "1");
            const { appEnv } = await importEnv();
            expect(appEnv.enableMockAuth).toBe(false);
        });
    });

    describe("URL normalization", () => {
        it("adds trailing slash to API base URL", async () => {
            vi.stubEnv("VITE_API_BASE_URL", "http://localhost:8000/api/v1");
            const { appEnv } = await importEnv();
            expect(appEnv.apiBaseUrl).toBe("http://localhost:8000/api/v1/");
        });

        it("keeps existing trailing slash on API base URL", async () => {
            vi.stubEnv("VITE_API_BASE_URL", "http://localhost:8000/api/v1/");
            const { appEnv } = await importEnv();
            expect(appEnv.apiBaseUrl).toBe("http://localhost:8000/api/v1/");
        });

        it("sets empty string when VITE_API_BASE_URL is missing", async () => {
            vi.stubEnv("VITE_API_BASE_URL", "");
            const { appEnv } = await importEnv();
            expect(appEnv.apiBaseUrl).toBe("");
        });
    });

    describe("path normalization", () => {
        it("strips leading and trailing slashes from auth login path", async () => {
            vi.stubEnv("VITE_AUTH_LOGIN_PATH", "/auth/token/");
            const { appEnv } = await importEnv();
            expect(appEnv.authLoginPath).toBe("auth/token");
        });

        it("handles clean path without extra slashes", async () => {
            vi.stubEnv("VITE_AUTH_LOGIN_PATH", "auth/token");
            const { appEnv } = await importEnv();
            expect(appEnv.authLoginPath).toBe("auth/token");
        });
    });

    describe("getApiBaseUrl", () => {
        it("returns the base URL when configured", async () => {
            vi.stubEnv("VITE_API_BASE_URL", "http://localhost:8000/api/v1");
            const { getApiBaseUrl } = await importEnv();
            expect(getApiBaseUrl()).toBe("http://localhost:8000/api/v1/");
        });

        it("throws when VITE_API_BASE_URL is missing", async () => {
            vi.stubEnv("VITE_API_BASE_URL", "");
            const { getApiBaseUrl } = await importEnv();
            expect(() => getApiBaseUrl()).toThrow("Missing VITE_API_BASE_URL");
        });
    });

    describe("getAuthLoginPath", () => {
        it("returns the login path when configured", async () => {
            vi.stubEnv("VITE_AUTH_LOGIN_PATH", "auth/token");
            const { getAuthLoginPath } = await importEnv();
            expect(getAuthLoginPath()).toBe("auth/token");
        });

        it("throws when VITE_AUTH_LOGIN_PATH is missing", async () => {
            vi.stubEnv("VITE_AUTH_LOGIN_PATH", "");
            const { getAuthLoginPath } = await importEnv();
            expect(() => getAuthLoginPath()).toThrow("Missing VITE_AUTH_LOGIN_PATH");
        });
    });

    describe("getAuthRefreshPath", () => {
        it("returns the refresh path when configured", async () => {
            vi.stubEnv("VITE_AUTH_REFRESH_PATH", "auth/token/refresh");
            const { getAuthRefreshPath } = await importEnv();
            expect(getAuthRefreshPath()).toBe("auth/token/refresh");
        });

        it("throws when VITE_AUTH_REFRESH_PATH is missing", async () => {
            vi.stubEnv("VITE_AUTH_REFRESH_PATH", "");
            const { getAuthRefreshPath } = await importEnv();
            expect(() => getAuthRefreshPath()).toThrow("Missing VITE_AUTH_REFRESH_PATH");
        });
    });
});
