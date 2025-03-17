"use client";

import useWebSocket from "@/hooks/useWebSocket";

const TrackDashboard = ({ userId }) => {
  useWebSocket(userId);

  return <div>Welkom bij je track-dashboard!</div>;
};

export default TrackDashboard;