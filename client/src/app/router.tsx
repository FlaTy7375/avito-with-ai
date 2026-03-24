import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdsListPage } from "../pages/ads-list";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/ads" replace />
    },
    {
        path: '/ads',
        element: <AdsListPage />
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