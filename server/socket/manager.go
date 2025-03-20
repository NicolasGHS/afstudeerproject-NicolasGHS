package socket

import (
	"context"
	"fmt"
	"sync"
	"syncopate/configs"
	"syncopate/models"
	"time"

	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var clients = make(map[string]*websocket.Conn)
var mu sync.Mutex

// RegisterUser koppelt een WebSocket-verbinding aan een userId
func RegisterUser(userId string, conn *websocket.Conn) {
	mu.Lock()
	defer mu.Unlock()
	clients[userId] = conn
	fmt.Println("User registered:", userId)

	go sendPendingNotifications(userId)
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
		saveNotification(userId, message)
	}
}

func saveNotification(userId, message string) {
	collection := configs.GetCollection(configs.DB, "notifications")

	notification := models.Notification{
		UserId:      userId,
		Message:     message,
		IsDelivered: false,
		CreatedAt:   primitive.NewDateTimeFromTime(time.Now()),
	}

	_, err := collection.InsertOne(context.Background(), notification)
	if err != nil {
		fmt.Println("Error saving notification:", err)
	}
}

func sendPendingNotifications(userId string) {
	collection := configs.GetCollection(configs.DB, "notifications")

	filter := bson.M{
		"userId":      userId,
		"isDelivered": false,
	}

	cursor, err := collection.Find(context.Background(), filter)
	if err != nil {
		fmt.Println("Error fetching pending notifications:", err)
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var notification models.Notification
		if err := cursor.Decode(&notification); err != nil {
			fmt.Println("Error decoding notification:", err)
			continue
		}

		// Verstuur notificatie naar de gebruiker
		conn, exists := clients[userId]
		if exists {
			conn.WriteMessage(websocket.TextMessage, []byte(notification.Message))

			// Markeer notificatie als afgeleverd
			collection.UpdateOne(
				context.Background(),
				bson.M{"_id": notification.Id},
				bson.M{"$set": bson.M{"isDelivered": true}},
				options.Update().SetUpsert(true),
			)
		}
	}
}
