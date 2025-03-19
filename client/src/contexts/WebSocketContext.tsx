"use client";

import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext<{ messages: string[]}>({ messages: []});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    // const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);


    useEffect(() => {
        const userId = "67c5724248d6ae787976a326";
        const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

        ws.onopen = () => {
            console.log("✅ WebSocket connected");
        };

        ws.onmessage = (event) => {
            console.log("🔔 Notificatie ontvangen:", event.data);
            setMessages((prev) => [...prev, event.data]);
        };

        ws.onclose = () => {
            console.log("❌ WebSocket connection closed");
            setTimeout(() => {
                const newSocket = new WebSocket(`ws://localhost:8000/ws/${userId}`);
                newSocket.onmessage = (event) => setMessages((prev) => [...prev, event.data]);
            }, 3000);
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ messages }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
