const socket = new WebSocket("ws://localhost:8000/ws");

socket.onopen = () => {
    console.log("Connected to WebSocket server");
};

socket.onmessage = (event) => {
    console.log("Message received:", event.data);
};

socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
};

socket.onclose = () => {
    console.log("WebSocket connection closed");
};

export default socket;
