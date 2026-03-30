import { api } from "@/lib/ApiService";

export interface ChatbotFilters {
    productType?: string | null;
    brand?: string | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    keywords?: string[];
    premium?: boolean | null;
}

export interface ChatbotProductItem {
    id: number;
    name: string;
    price?: number | null;
    brand?: string | null;
    imageUrl?: string | null;
    productUrl?: string | null;
    productType?: string | null;
    availableQuantity?: number | null;
    reason?: string | null;
}

export interface ChatbotRecommendPayload {
    reply?: string | null;
    needsClarification?: boolean;
    clarificationQuestion?: string | null;
    filters?: ChatbotFilters | null;
    products?: ChatbotProductItem[];
}

type ApiEnvelope<T> = {
    code: number;
    message?: string;
    result: T;
};

export async function recommendProducts(message: string): Promise<ChatbotRecommendPayload> {
    const response = await api.post<ApiEnvelope<ChatbotRecommendPayload>>("/api/chatbot/recommend", {
        message,
    });

    return response.data?.result ?? {
        reply: "Mình chưa nhận được phản hồi hợp lệ từ hệ thống tư vấn.",
        products: [],
    };
}
