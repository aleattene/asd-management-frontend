import { describe, it, expect, beforeEach } from "vitest";
import {
    AUTH_STORAGE_KEYS,
    getStoredAccessToken,
    getStoredRefreshToken,
    getStoredUsername,
    setStoredTokens,
    setStoredUsername,
    getErrorMessage,
} from "./client";

describe("AUTH_STORAGE_KEYS", () => {
    it("defines expected storage key names", () => {
        expect(AUTH_STORAGE_KEYS.accessToken).toBe("asd-management.auth.access-token");
        expect(AUTH_STORAGE_KEYS.refreshToken).toBe("asd-management.auth.refresh-token");
        expect(AUTH_STORAGE_KEYS.username).toBe("asd-management.auth.username");
    });
});

describe("token storage helpers", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    describe("getStoredAccessToken", () => {
        it("returns empty string when no token stored", () => {
            expect(getStoredAccessToken()).toBe("");
        });

        it("returns stored access token", () => {
            sessionStorage.setItem(AUTH_STORAGE_KEYS.accessToken, "my-token");
            expect(getStoredAccessToken()).toBe("my-token");
        });
    });

    describe("getStoredRefreshToken", () => {
        it("returns empty string when no token stored", () => {
            expect(getStoredRefreshToken()).toBe("");
        });

        it("returns stored refresh token", () => {
            sessionStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, "my-refresh");
            expect(getStoredRefreshToken()).toBe("my-refresh");
        });
    });

    describe("getStoredUsername", () => {
        it("returns empty string when no username stored", () => {
            expect(getStoredUsername()).toBe("");
        });

        it("returns stored username", () => {
            sessionStorage.setItem(AUTH_STORAGE_KEYS.username, "admin");
            expect(getStoredUsername()).toBe("admin");
        });
    });

    describe("setStoredTokens", () => {
        it("stores access and refresh tokens", () => {
            setStoredTokens({ accessToken: "access-1", refreshToken: "refresh-1" });

            expect(sessionStorage.getItem(AUTH_STORAGE_KEYS.accessToken)).toBe("access-1");
            expect(sessionStorage.getItem(AUTH_STORAGE_KEYS.refreshToken)).toBe("refresh-1");
        });

        it("removes access token when empty string is passed", () => {
            sessionStorage.setItem(AUTH_STORAGE_KEYS.accessToken, "old");

            setStoredTokens({ accessToken: "", refreshToken: "refresh-1" });

            expect(sessionStorage.getItem(AUTH_STORAGE_KEYS.accessToken)).toBeNull();
            expect(sessionStorage.getItem(AUTH_STORAGE_KEYS.refreshToken)).toBe("refresh-1");
        });

        it("removes refresh token when empty string is passed", () => {
            sessionStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, "old");

            setStoredTokens({ accessToken: "access-1", refreshToken: "" });

            expect(sessionStorage.getItem(AUTH_STORAGE_KEYS.accessToken)).toBe("access-1");
            expect(sessionStorage.getItem(AUTH_STORAGE_KEYS.refreshToken)).toBeNull();
        });

        it("removes both tokens when both are empty", () => {
            sessionStorage.setItem(AUTH_STORAGE_KEYS.accessToken, "old-a");
            sessionStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, "old-r");

            setStoredTokens({ accessToken: "", refreshToken: "" });

            expect(sessionStorage.getItem(AUTH_STORAGE_KEYS.accessToken)).toBeNull();
            expect(sessionStorage.getItem(AUTH_STORAGE_KEYS.refreshToken)).toBeNull();
        });
    });

    describe("setStoredUsername", () => {
        it("stores username", () => {
            setStoredUsername("admin");
            expect(sessionStorage.getItem(AUTH_STORAGE_KEYS.username)).toBe("admin");
        });

        it("removes username when empty string is passed", () => {
            sessionStorage.setItem(AUTH_STORAGE_KEYS.username, "old-user");

            setStoredUsername("");

            expect(sessionStorage.getItem(AUTH_STORAGE_KEYS.username)).toBeNull();
        });

        it("removes username when called without arguments", () => {
            sessionStorage.setItem(AUTH_STORAGE_KEYS.username, "old-user");

            setStoredUsername();

            expect(sessionStorage.getItem(AUTH_STORAGE_KEYS.username)).toBeNull();
        });
    });
});

describe("getErrorMessage", () => {
    it("returns detail from API error response", () => {
        const error = {
            response: { data: { detail: "Invalid credentials" } },
            message: "Request failed",
        };

        expect(getErrorMessage(error, "Fallback")).toBe("Invalid credentials");
    });

    it("returns message from API error response when detail is absent", () => {
        const error = {
            response: { data: { message: "Not found" } },
        };

        expect(getErrorMessage(error, "Fallback")).toBe("Not found");
    });

    it("returns axios error message when response data has no detail or message", () => {
        const error = {
            response: { data: {} },
            message: "Network Error",
        };

        expect(getErrorMessage(error, "Fallback")).toBe("Network Error");
    });

    it("returns fallback when error has no useful information", () => {
        expect(getErrorMessage({}, "Something went wrong")).toBe("Something went wrong");
    });

    it("returns fallback for null error", () => {
        expect(getErrorMessage(null, "Fallback")).toBe("Fallback");
    });

    it("returns fallback for undefined error", () => {
        expect(getErrorMessage(undefined, "Fallback")).toBe("Fallback");
    });

    it("prefers detail over message when both are present", () => {
        const error = {
            response: {
                data: { detail: "Specific error", message: "Generic error" },
            },
            message: "Axios error",
        };

        expect(getErrorMessage(error, "Fallback")).toBe("Specific error");
    });
});
