"use client";

import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    // const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>(() => {
        // 🟢 Haal berichten uit localStorage bij laden
        if (typeof window !== "undefined") {
          return JSON.parse(localStorage.getItem("notifications") || "[]");
        }
        return [];
      });

    useEffect(() => {
        const userId = "67c5724248d6ae787976a326";
        const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

        ws.onopen = () => {
            console.log("✅ WebSocket connected");
        };

        ws.onmessage = (event) => {
            const newMessage = event.data;
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, newMessage];

                // sla berichten op in localStorage
                localStorage.setItem("notifications", JSON.stringify(updatedMessages));

                return updatedMessages;
            });
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

    const removeMessage = (index: number) => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.filter((_, i) => i !== index);
          localStorage.setItem("notifications", JSON.stringify(updatedMessages)); // Update localStorage
          return updatedMessages;
        });
      };


    return (
        <WebSocketContext.Provider value={{ messages, removeMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
