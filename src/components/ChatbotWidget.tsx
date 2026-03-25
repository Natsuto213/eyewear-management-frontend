import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Chào bạn! Mình là AI tư vấn viên của Eyewear. Bạn đang tìm loại mắt kính nào ạ?", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Tự động cuộn xuống tin nhắn cuối cùng
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // 1. Thêm tin nhắn của User vào khung chat
        const newUserMsg = { id: Date.now(), text: inputValue, sender: "user" };
        setMessages((prev) => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);

        // 2. GIẢ LẬP GỌI API AI (Bạn sẽ thay đoạn setTimeout này bằng axios gọi API tới BE)
        setTimeout(() => {
            const botReply = {
                id: Date.now() + 1,
                text: "Xin lỗi, hiện tại tớ đang trong quá trình học tập nên chưa thể trả lời câu hỏi này. Bạn hãy liên hệ hotline nhé!",
                sender: "bot"
            };
            setMessages((prev) => [...prev, botReply]);
            setIsTyping(false);
        }, 1500); // Giả vờ AI đang suy nghĩ mất 1.5 giây
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Khung Chat (Chỉ hiện khi isOpen = true) */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-5">
                    {/* Header Chat */}
                    <div className="bg-black text-white px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Eyewear AI Assistant</h3>
                                <p className="text-[10px] text-green-400 font-medium">● Đang hoạt động</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Vùng hiển thị tin nhắn */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.sender === "user" ? "bg-black text-white rounded-tr-sm" : "bg-gray-200 text-gray-800 rounded-tl-sm"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Hiệu ứng AI đang gõ chữ */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-200 text-gray-500 rounded-2xl rounded-tl-sm px-4 py-3 text-sm flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Ô nhập tin nhắn */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 bg-gray-100 border-transparent rounded-full px-4 py-2 text-sm focus:ring-black focus:border-black outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            <Send className="w-4 h-4 ml-[-2px]" />
                        </button>
                    </form>
                </div>
            )}

            {/* Nút bấm tròn (Luôn hiện ở góc) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-black text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform relative group"
                >
                    <MessageCircle className="w-6 h-6" />
                    {/* Tooltip nhỏ khi hover */}
                    <span className="absolute right-16 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-200 pointer-events-none">
                        Chat với AI
                    </span>
                </button>
            )}
        </div>
    );
}