import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppShell } from "../shared/ui/AppShell.jsx";
import { HomePage } from "../features/dashboard/HomePage.jsx";
import { ResourceListPage } from "../features/resources/ResourceListPage.jsx";
import { ResourceFormPage } from "../features/resources/ResourceFormPage.jsx";
import { resourceRegistry } from "../features/resources/resourceRegistry.js";
import { useAuth } from "../shared/auth/AuthProvider.jsx";

function ProtectedLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <AppShell />;
}

// Each registered resource generates the standard CRUD routes used by the app.
const resourceRoutes = resourceRegistry.flatMap((resource) => [
    {
        path: resource.path,
        element: <ResourceListPage resource={resource} />,
    },
    {
        path: `${resource.path}/new`,
        element: <ResourceFormPage resource={resource} mode="create" />,
    },
    {
        path: `${resource.path}/:id/edit`,
        element: <ResourceFormPage resource={resource} mode="edit" />,
    },
]);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        element: <ProtectedLayout />,
        children: [
            {
                path: "/dashboard",
                element: <Navigate to="/overview" replace />,
            },
            {
                path: "/overview",
                element: <HomePage mode="dashboard" />,
            },
            // Resource routes are nested here so they all render inside the shared shell layout.
            ...resourceRoutes,
        ],
    },
]);
