import { api } from "../../shared/api/instance";
import type { Ad, AdsResponse ,AdsParams } from "./types";

export const getAd = async (id: number): Promise<Ad> => {
    const { data } = await api.get<Ad>(`/items/${id}`)
    return data;
}

export const getAds = async (params?: AdsParams): Promise<AdsResponse> => {
    const { data } = await api.get<AdsResponse>('/items', { params });
    return data;
}

export const updateAd = async (id: number, body: { category: Ad['category']; title: string; description?: string; price: number; params: Record<string, unknown> }): Promise<{ success: boolean }> => {
    const { data } = await api.put<{ success: boolean }>(`/items/${id}`, body);
    return data;
}