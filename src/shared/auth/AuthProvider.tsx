import {
    createContext,
    useEffect,
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
} from "../api/client";
import { appEnv, getAuthLoginPath } from "../config/env";

interface AuthState {
    accessToken: string;
    refreshToken: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface LoginCredentials {
    username: string;
    password: string;
}

interface AuthContextValue {
    isAuthenticated: boolean;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
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
            firstName: "",
            lastName: "",
            role: "",
        };
    }

    return {
        accessToken: getStoredAccessToken(),
        refreshToken: getStoredRefreshToken(),
        username: getStoredUsername(),
        firstName: "",
        lastName: "",
        role: "",
    };
}

interface UserMeResponse {
    username?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
}

function applyUserProfile(
    currentState: AuthState,
    profile: UserMeResponse,
) {
    return {
        ...currentState,
        username: profile.username ?? currentState.username,
        firstName: profile.first_name ?? "",
        lastName: profile.last_name ?? "",
        role: profile.role ?? "",
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>(readInitialAuth);

    useEffect(() => {
        let cancelled = false;

        async function loadCurrentUser() {
            if (!authState.accessToken || appEnv.enableMockAuth) {
                return;
            }

            try {
                const response = await apiClient.get<UserMeResponse>("users/me/");

                if (!cancelled) {
                    setAuthState((currentState) =>
                        applyUserProfile(currentState, response.data),
                    );
                }
            } catch {
                if (!cancelled) {
                    setStoredTokens({ accessToken: "", refreshToken: "" });
                    setAuthState({
                        accessToken: "",
                        refreshToken: "",
                        username: "",
                        firstName: "",
                        lastName: "",
                        role: "",
                    });
                }
            }
        }

        loadCurrentUser();

        return () => {
            cancelled = true;
        };
    }, [authState.accessToken]);

    const value = useMemo<AuthContextValue>(
        () => ({
            isAuthenticated: Boolean(authState.accessToken),
            username: authState.username,
            firstName: authState.firstName,
            lastName: authState.lastName,
            role: authState.role,
            async login(credentials) {
                const username = credentials.username.trim();
                const password = credentials.password;

                if (appEnv.enableMockAuth) {
                    const mockSession: AuthState = {
                        accessToken: "mock-jwt-access-token",
                        refreshToken: "mock-jwt-refresh-token",
                        username: username || "admin",
                        firstName: "Demo",
                        lastName: "User",
                        role: "admin",
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
                    firstName: "",
                    lastName: "",
                    role: "",
                };

                if (!session.accessToken) {
                    throw new Error("JWT login response missing access token.");
                }

                const profileResponse = await apiClient.get<UserMeResponse>("users/me/", {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });

                const nextSession = applyUserProfile(session, profileResponse.data);
                setStoredTokens(session);
                setStoredUsername(nextSession.username);
                setAuthState(nextSession);

                return nextSession;
            },
            logout() {
                setStoredTokens({ accessToken: "", refreshToken: "" });
                setStoredUsername("");
                setAuthState({
                    accessToken: "",
                    refreshToken: "",
                    username: "",
                    firstName: "",
                    lastName: "",
                    role: "",
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
