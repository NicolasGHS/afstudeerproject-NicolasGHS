"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "@/lib/users/api";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    // const [socket, setSocket] = useState<WebSocket | null>(null);
    const [userId, setUserId] = useState();
    const [messages, setMessages] = useState<[]>(() => {
        // 🟢 Haal berichten uit localStorage bij laden
        if (typeof window !== "undefined") {
          return JSON.parse(localStorage.getItem("notifications") || "[]");
        }
        return [];
      });

    useEffect(() => {
      const fetchUser = async () => {
        const user = await getUser();

        setUserId(user?.id);
      }

      fetchUser();
    }, []);

    console.log("userId: ", userId);

    useEffect(() => {
        // const testId = "67c5724248d6ae787976a326";
        if (!userId) return;

        const ws = new WebSocket(`ws://${process.env.NEXT_PUBLIC_API_URL}/ws/${userId}`);

        ws.onopen = () => {
            console.log("✅ WebSocket connected");
        };

        ws.onmessage = (event) => {
            try {
                const newMessage = JSON.parse(event.data); // 🔹 Parse hier als object
                
                // add notification id
                const messageWithId = {
                  ...newMessage,
                  notificationId: Date.now(),
              };
                
                setMessages((prevMessages) => {
                  const updatedMessages = [...prevMessages, messageWithId]; 
                  localStorage.setItem("notifications", JSON.stringify(updatedMessages)); 
                  return updatedMessages;
                });
              } catch (error) {
                console.error("Fout bij het parsen van WebSocket-bericht:", error);
              }
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
            setTimeout(() => {
                const newSocket = new WebSocket(`wss://afstudeerproject-nicolasghs.onrender.com/ws/${userId}`);
                newSocket.onmessage = (event) => setMessages((prev) => [...prev, event.data]);
            }, 3000);
        };

        return () => {
            ws.close();
        };
    }, [userId]);

    console.log("message: ", messages);

    const removeMessage = (notificationId: number) => {
      setMessages((prevMessages) => {
          const updatedMessages = prevMessages.filter((message) => message.notificationId !== notificationId);
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
