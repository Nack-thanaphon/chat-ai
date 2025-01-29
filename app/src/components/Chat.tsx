import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";

interface Message {
    sender: "user" | "bot";
    text: string;
    timestamp: Date;
}

interface ApiResponse {
    _id: string;
    userId: string;
    message: string;
    sender: "user" | "bot";
    createdAt: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = async () => {
        if (!message.trim() || isLoading) return;

        try {
            setIsLoading(true);
            const newMessage: Message = {
                sender: "user",
                text: message,
                timestamp: new Date(),
            };
            const newMessages = [...messages, newMessage];
            setMessages(newMessages);

            const response = await axios.post<ApiResponse[]>("http://localhost:3000/chat", {
                userId: "guest",
                message: message.trim(),
            });

            const botResponse: Message = {
                sender: "bot",
                text: response.data[response.data.length - 1].message,
                timestamp: new Date(),
            };

            setMessages([...newMessages, botResponse]);
            setMessage("");
        } catch (error) {
            const errorMessage: Message = {
                sender: "bot",
                text: "Sorry, something went wrong. Please try again." + error,
                timestamp: new Date(),
            };
            setMessages([...messages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5E6D3] p-4">
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl">
                <div className="bg-[#4A321F] rounded-t-2xl p-6 text-center">
                    <h1 className="text-3xl font-bold text-[#F5E6D3] font-serif">
                        ☕ Coffee Man Chat
                    </h1>
                    <p className="text-[#D4B596] mt-2">แชทกับผู้เชี่ยวชาญด้านกาแฟ</p>
                </div>
                <div className="h-[60vh] overflow-y-auto p-6 space-y-6 bg-[#FDF8F3]">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.sender === "bot" && (
                                <div className="w-8 h-8 rounded-full bg-[#4A321F] flex items-center justify-center text-white mr-2">
                                    ☕
                                </div>
                            )}
                            <div
                                className={`max-w-[70%] px-6 py-3 rounded-2xl shadow-md 
                                    ${msg.sender === "user"
                                        ? "bg-[#4A321F] text-white"
                                        : "bg-white text-[#2C1810]"
                                    }`}
                            >
                                <p className="leading-relaxed">{msg.text}</p>
                                <span className={`text-xs mt-2 block ${msg.sender === "user"
                                        ? "text-[#D4B596]"
                                        : "text-[#8B7355]"
                                    }`}>
                                    {msg.timestamp.toLocaleTimeString('th-TH')}
                                </span>
                            </div>
                            {msg.sender === "user" && (
                                <div className="w-8 h-8 rounded-full bg-[#6F4E37] flex items-center justify-center text-white ml-2">
                                    👤
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-6 border-t border-[#E8D5C4]">
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            className="flex-1 px-6 py-3 border-2 border-[#D4B596] rounded-xl 
                                     focus:outline-none focus:ring-2 focus:ring-[#4A321F] 
                                     bg-[#FDF8F3] text-[#2C1810] placeholder-[#8B7355]"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="พิมพ์ข้อความของคุณที่นี่..."
                            disabled={isLoading}
                        />
                        <button
                            className={`px-8 py-3 rounded-xl font-medium transition-all duration-200
                                ${isLoading
                                    ? "bg-[#8B7355] cursor-not-allowed"
                                    : "bg-[#4A321F] hover:bg-[#2C1810] active:scale-95"
                                } text-white`}
                            onClick={sendMessage}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังส่ง...
                                </span>
                            ) : (
                                <PaperAirplaneIcon className="h-6 w-6 transform rotate-45" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;