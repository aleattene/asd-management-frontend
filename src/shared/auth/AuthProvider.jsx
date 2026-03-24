import { createContext, useContext, useMemo, useState } from "react";
import {
    getStoredAccessToken,
    getStoredRefreshToken,
    getStoredUsername,
    setStoredTokens,
    setStoredUsername,
} from "../api/client.js";

const AuthContext = createContext(null);

function readInitialAuth() {
    if (typeof window === "undefined") {
        return {
            accessToken: "",
            refreshToken: "",
            username: "",
        };
    }

    return {
        accessToken: getStoredAccessToken(),
        refreshToken: getStoredRefreshToken(),
        username: getStoredUsername(),
    };
}

export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState(readInitialAuth);

    const value = useMemo(
        () => ({
            isAuthenticated: Boolean(authState.accessToken),
            username: authState.username,
            // Placeholder for the future JWT login call to Django/DRF.
            async login(credentials) {
                const username = credentials.username || "admin";
                const mockSession = {
                    accessToken: "mock-jwt-access-token",
                    refreshToken: "mock-jwt-refresh-token",
                    username,
                };

                setStoredTokens(mockSession);
                setStoredUsername(username);
                setAuthState(mockSession);

                return mockSession;
            },
            logout() {
                setStoredTokens({ accessToken: "", refreshToken: "" });
                setStoredUsername("");
                setAuthState({
                    accessToken: "",
                    refreshToken: "",
                    username: "",
                });
            },
        }),
        [authState],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}
