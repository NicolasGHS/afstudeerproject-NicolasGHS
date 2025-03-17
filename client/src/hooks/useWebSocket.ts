"use client";

import { useEffect } from "react";

const useWebSocket = (userId: string) => {
    useEffect(() => {
        if (!userId) return;

        const ws = new WebSocket(`ws://localhost:8080/ws?userId=${userId}`);

        ws.onmessage = (event) => {
            alert(event.data); // Toon notificatie als alert (of UI-popup)
        };

        return () => {
            ws.close();
        };
    }, [userId]);
};

export default useWebSocket;