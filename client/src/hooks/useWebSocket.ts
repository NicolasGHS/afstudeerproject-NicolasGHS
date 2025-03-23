"use client";

import { useEffect } from "react";

const useWebSocket = (userId: string) => {
    useEffect(() => {
        if (!userId) return; // Wacht tot userId geladen is
      
        console.log("WebSocket verbinden met userId:", userId);
        const ws = new WebSocket(`ws://${process.env.NEXT_PUBLIC_API_URL}/ws?userId=${userId}`);
      
        ws.onopen = () => console.log("WebSocket verbinding geopend!");

        ws.onmessage = (event) => {
            console.log("Bericht ontvangen:", event.data);
            alert(event.data); // Dit toont het bericht dat je ontvangt
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        
        ws.onclose = () => console.log("WebSocket verbinding gesloten");
      
        return () => {
          ws.close();
        };
      }, [userId]);
};

export default useWebSocket;