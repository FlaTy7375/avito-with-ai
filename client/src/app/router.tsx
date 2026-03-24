import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdsListPage } from "../pages/ads-list";
import { AdViewPage } from "../pages/ad-view-page";

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
        element: <AdViewPage />
    },
    {
        path: '/ads/:id/edit',
        element: <div>Ads id edit</div>
    }
])