package socket

import (
	"fmt"
	"sync"

	"github.com/gorilla/websocket"
)

var clients = make(map[string]*websocket.Conn)
var mu sync.Mutex

// RegisterUser koppelt een WebSocket-verbinding aan een userId
func RegisterUser(userId string, conn *websocket.Conn) {
	mu.Lock()
	defer mu.Unlock()
	clients[userId] = conn
	fmt.Println("User registered:", userId)
}

// UnregisterUser verwijdert de gebruiker bij disconnect
func UnregisterUser(userId string) {
	mu.Lock()
	defer mu.Unlock()
	delete(clients, userId)
	fmt.Println("User unregistered:", userId)
}

// NotifyUser stuurt een bericht naar een specifieke userId
func NotifyUser(userId string, message string) {
	mu.Lock()
	conn, exists := clients[userId]
	mu.Unlock()

	if exists {
		err := conn.WriteMessage(websocket.TextMessage, []byte(message))
		if err != nil {
			fmt.Println("Error sending message:", err)
			UnregisterUser(userId) // Verwijder gebruiker bij fout
		}
	} else {
		fmt.Println("User not connected:", userId)
	}
}
