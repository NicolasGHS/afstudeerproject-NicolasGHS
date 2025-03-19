package main

import (
	"fmt"
	"net/http"
	"syncopate/configs"
	"syncopate/routes"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Pas dit aan voor productie om restricties op te leggen
	},
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading connection:", err)
		return
	}
	defer conn.Close()

	fmt.Println("Client connected")

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message:", err)
			break
		}
		fmt.Printf("Received: %s\n", msg)

		// Echo het bericht terug
		err = conn.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			fmt.Println("Error writing message:", err)
			break
		}
	}
}

func main() {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "https://127.0.0.1:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodDelete},
	}))

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	// run db
	configs.ConnectDB()

	// routes
	routes.UserRoute(e)
	routes.TrackRoute(e)
	routes.InstrumentRoute(e)
	routes.AudioTrackRoute(e)
	routes.SetupRoutes(e)

	e.GET("/ws", func(c echo.Context) error {
		handleConnections(c.Response(), c.Request())
		return nil
	})

	e.Logger.Fatal(e.Start(":8000"))
}
