package websocket

import (
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"net/http"
	"sync"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[string]*websocket.Conn)
var mutex = sync.Mutex{}

// WebSocket handler
func HandleWebSocket(c echo.Context) error {
	userId := c.QueryParam("userId") // userId wordt als query parameter meegegeven
	if userId == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "User ID is required"})
	}

	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		fmt.Println("WebSocket upgrade error:", err)
		return err
	}

	mutex.Lock()
	clients[userId] = conn
	mutex.Unlock()

	defer func() {
		mutex.Lock()
		delete(clients, userId)
		mutex.Unlock()
		conn.Close()
	}()

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("WebSocket error:", err)
			break
		}
	}

	return nil
}

// Functie om notificaties te sturen
func NotifyUser(userId, message string) {
	fmt.Println("Versturen bericht naar:", userId, "Bericht:", message) // <-- Toegevoegd

	message = "🎵 Testbericht vanuit de WebSocket-server!"

	mutex.Lock()
	conn, exists := clients[userId]
	mutex.Unlock()

	if exists {
		err := conn.WriteMessage(websocket.TextMessage, []byte(message))
		if err != nil {
			fmt.Println("Error bij verzenden:", err)
		} else {
			fmt.Println("Bericht succesvol verzonden aan", userId)
		}
	} else {
		fmt.Println("Geen actieve WebSocket-verbinding voor", userId)
	}
}
