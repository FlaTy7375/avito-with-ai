import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/ads" replace />
    },
    {
        path: '/ads',
        element: <div>Ads List</div>
    },
    {
        path: '/ads/:id',
        element: <div>Ads id</div>
    },
    {
        path: '/ads/:id/edit',
        element: <div>Ads id edit</div>
    }
])