"use client";

import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    // const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<[]>(() => {
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
            try {
                const newMessage = JSON.parse(event.data); // 🔹 Parse hier als object
                setMessages((prevMessages) => {
                  const updatedMessages = [...prevMessages, newMessage]; 
                  localStorage.setItem("notifications", JSON.stringify(updatedMessages)); 
                  return updatedMessages;
                });
              } catch (error) {
                console.error("❌ Fout bij het parsen van WebSocket-bericht:", error);
              }
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

    console.log("message: ", messages);

    const removeMessage = (index: number) => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.filter((_, i) => i !== index);
          localStorage.setItem("notifications", JSON.stringify(updatedMessages));
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
