"use client";

import useWebSocket from "@/hooks/useWebSocket";
import { getUser } from "@/lib/users/api";
import { useEffect, useState } from "react";

const TrackDashboard = () => {
  const [user, setUser] = useState(null);

  // Haal de gebruiker op bij de eerste render
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []); // Gebruik een lege array om deze alleen één keer uit te voeren bij de eerste render

  useWebSocket(user?.id);
  return <div>Welkom bij je track-dashboard!</div>;
};

export default TrackDashboard;
