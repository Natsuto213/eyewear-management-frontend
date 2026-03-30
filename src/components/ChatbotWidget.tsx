import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { recommendProducts, type ChatbotProductItem } from "@/lib/chatbotApi";

type ChatSender = "user" | "bot";

type ChatMessage = {
    id: string;
    sender: ChatSender;
    text: string;
    products?: ChatbotProductItem[];
    isError?: boolean;
};

const SUGGESTIONS = [
    "Tôi muốn tìm 1 gọng kính giá từ 1 triệu đến 2 triệu",
    "Tôi muốn mua 1 gọng kính Rayban cao cấp",
    "Tư vấn giúp tôi 2-3 kính áp tròng phù hợp",
];

const createMessageId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const formatCurrency = (price?: number | null) => {
    if (typeof price !== "number") {
        return "Liên hệ";
    }
    return `${price.toLocaleString("vi-VN")}đ`;
};

export default function ChatbotWidget() {
    const location = useLocation();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: createMessageId(),
            sender: "bot",
            text: "Chào bạn! Mình là AI tư vấn của Eyewear Sora. Bạn đang muốn tìm gọng kính, tròng kính hay kính áp tròng?",
        },
    ]);

    const pathname = location.pathname;
    const shouldRender =
        pathname === "/" ||
        pathname.startsWith("/all-product") ||
        pathname.startsWith("/product/");

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isSubmitting]);

    if (!shouldRender) {
        return null;
    }

    const appendBotMessage = (text: string, products: ChatbotProductItem[] = [], isError = false) => {
        setMessages((prev) => [
            ...prev,
            {
                id: createMessageId(),
                sender: "bot",
                text,
                products,
                isError,
            },
        ]);
    };

    const submitMessage = async (rawMessage: string) => {
        const message = rawMessage.trim();
        if (!message || isSubmitting) {
            return;
        }

        // Add the customer message immediately so the chat feels responsive
        // even while the backend is still parsing intent and ranking products.
        setMessages((prev) => [
            ...prev,
            {
                id: createMessageId(),
                sender: "user",
                text: message,
            },
        ]);

        setInputValue("");
        setIsSubmitting(true);

        try {
            const response = await recommendProducts(message);
            const replyText =
                response.reply ||
                response.clarificationQuestion ||
                "Mình đã nhận câu hỏi của bạn nhưng chưa tạo được phản hồi phù hợp.";

            appendBotMessage(replyText, response.products ?? []);
        } catch (error) {
            console.error("Chatbot request failed:", error);
            appendBotMessage(
                "Xin lỗi, mình chưa thể kết nối tới hệ thống tư vấn lúc này. Bạn thử lại sau ít phút nhé.",
                [],
                true
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await submitMessage(inputValue);
    };

    const handleSuggestionClick = async (suggestion: string) => {
        if (!isOpen) {
            setIsOpen(true);
        }
        await submitMessage(suggestion);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="mb-4 flex h-[560px] w-[360px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                    <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold">Eyewear AI Assistant</h3>
                                <p className="text-[11px] text-emerald-300">Đang tư vấn sản phẩm theo nhu cầu của bạn</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="border-b border-stone-200 bg-stone-50 px-4 py-3">
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Gợi ý nhanh</p>
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTIONS.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => void handleSuggestionClick(suggestion)}
                                    disabled={isSubmitting}
                                    className="rounded-full border border-stone-200 bg-white px-3 py-2 text-left text-xs text-stone-700 transition-colors hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50 p-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className="max-w-[88%]">
                                    <div
                                        className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                                            message.sender === "user"
                                                ? "rounded-tr-sm bg-black text-white"
                                                : message.isError
                                                ? "rounded-tl-sm bg-red-50 text-red-700"
                                                : "rounded-tl-sm bg-white text-stone-800 shadow-sm ring-1 ring-stone-200"
                                        }`}
                                    >
                                        {message.text}
                                    </div>

                                    {message.products && message.products.length > 0 && (
                                        <div className="mt-3 space-y-3">
                                            {message.products.map((product) => (
                                                <Link
                                                    key={`${message.id}-${product.id}`}
                                                    to={`/product/${product.id}`}
                                                    className="block rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-black"
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-stone-100">
                                                            {product.imageUrl ? (
                                                                <img
                                                                    src={product.imageUrl}
                                                                    alt={product.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <MessageCircle className="h-6 w-6 text-stone-400" />
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <p className="line-clamp-2 text-sm font-semibold text-stone-900">{product.name}</p>
                                                            <p className="mt-1 text-xs text-stone-500">{product.brand || "Thương hiệu đang cập nhật"}</p>
                                                            <p className="mt-2 text-sm font-bold text-red-600">{formatCurrency(product.price)}</p>
                                                            {product.reason && (
                                                                <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-600">{product.reason}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3 text-xs font-medium">
                                                        <span className="text-stone-500">
                                                            {typeof product.availableQuantity === "number"
                                                                ? `Tồn kho: ${product.availableQuantity}`
                                                                : "Kiểm tra chi tiết"}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 text-black">
                                                            Xem chi tiết
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isSubmitting && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-stone-500 shadow-sm ring-1 ring-stone-200">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" />
                                        <span
                                            className="h-2 w-2 animate-bounce rounded-full bg-stone-400"
                                            style={{ animationDelay: "0.15s" }}
                                        />
                                        <span
                                            className="h-2 w-2 animate-bounce rounded-full bg-stone-400"
                                            style={{ animationDelay: "0.3s" }}
                                        />
                                        <span className="ml-2">AI đang phân tích nhu cầu của bạn...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="border-t border-stone-200 bg-white p-3">
                        <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-2 py-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(event) => setInputValue(event.target.value)}
                                placeholder="Nhập nhu cầu của bạn, ví dụ: gọng kính Rayban dưới 2 triệu"
                                className="flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-stone-400"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isSubmitting}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-[0_18px_45px_rgba(0,0,0,0.25)] transition-transform hover:scale-105"
                >
                    <Sparkles className="h-7 w-7" />
                    <span className="pointer-events-none absolute right-20 whitespace-nowrap rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-black opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                        Tư vấn bằng AI
                    </span>
                </button>
            )}
        </div>
    );
}