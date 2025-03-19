"use client";

import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const userId = "67c5724248d6ae787976a326";
        const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

        ws.onopen = () => {
            console.log("✅ WebSocket connected");
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            console.log("🔔 Notificatie ontvangen:", event.data);
        };

        ws.onclose = () => {
            console.log("❌ WebSocket connection closed");
            setSocket(null);
            // Optioneel: probeer opnieuw te verbinden na een tijdje
            setTimeout(() => {
                setSocket(new WebSocket(`ws://localhost:8000/ws/${userId}`));
            }, 3000);
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
