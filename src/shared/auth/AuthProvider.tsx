import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import {
    apiClient,
    getStoredAccessToken,
    getStoredRefreshToken,
    getStoredUsername,
    setStoredTokens,
    setStoredUsername,
} from "../api/client.js";
import { appEnv, getAuthLoginPath } from "../config/env";

interface AuthState {
    accessToken: string;
    refreshToken: string;
    username: string;
}

interface LoginCredentials {
    username: string;
    password: string;
}

interface AuthContextValue {
    isAuthenticated: boolean;
    username: string;
    login: (credentials: LoginCredentials) => Promise<AuthState>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readInitialAuth(): AuthState {
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

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>(readInitialAuth);

    const value = useMemo<AuthContextValue>(
        () => ({
            isAuthenticated: Boolean(authState.accessToken),
            username: authState.username,
            async login(credentials) {
                const username = credentials.username.trim();
                const password = credentials.password;

                if (appEnv.enableMockAuth) {
                    const mockSession: AuthState = {
                        accessToken: "mock-jwt-access-token",
                        refreshToken: "mock-jwt-refresh-token",
                        username: username || "admin",
                    };

                    setStoredTokens(mockSession);
                    setStoredUsername(mockSession.username);
                    setAuthState(mockSession);

                    return mockSession;
                }

                const response = await apiClient.post(getAuthLoginPath(), {
                    username,
                    password,
                });

                const session: AuthState = {
                    accessToken: response.data?.access ?? "",
                    refreshToken: response.data?.refresh ?? "",
                    username,
                };

                if (!session.accessToken) {
                    throw new Error("JWT login response missing access token.");
                }

                setStoredTokens(session);
                setStoredUsername(session.username);
                setAuthState(session);

                return session;
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
