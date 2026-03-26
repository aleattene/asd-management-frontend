import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppShell } from "../shared/ui/AppShell";
import { HomePage } from "../features/dashboard/HomePage";
import { ResourceListPage } from "../features/resources/ResourceListPage";
import { ResourceFormPage } from "../features/resources/ResourceFormPage";
import { resourceRegistry } from "../features/resources/resourceRegistry";
import { useAuth } from "../shared/auth/AuthProvider";

function ProtectedLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <AppShell />;
}

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
            ...resourceRoutes,
        ],
    },
]);
