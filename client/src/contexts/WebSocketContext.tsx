// context/WebSocketContext.tsx

import { createContext, useContext, useEffect, useState } from 'react';

// Context voor WebSocket
const WebSocketContext = createContext<WebSocket | null>(null);

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

interface WebSocketProviderProps {
    children: React.ReactNode;
    userId: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ userId, children }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (!userId) return; // Wacht tot userId beschikbaar is

        // Maak verbinding met WebSocket server
        const socket = new WebSocket(`ws://localhost:8000/ws?userId=${userId}`);

        socket.onopen = () => {
            console.log("WebSocket verbinding geopend voor userId:", userId);
        };

        socket.onmessage = (event) => {
            console.log("Bericht ontvangen:", event.data);
            // Hier kun je je notificatie- of UI logica toevoegen
        };

        socket.onerror = (error) => {
            console.error("WebSocket fout:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket verbinding gesloten voor userId:", userId);
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, [userId]);

    return <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>;
};
