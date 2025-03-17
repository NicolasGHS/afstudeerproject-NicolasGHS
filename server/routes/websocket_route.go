package routes

import (
	"github.com/labstack/echo/v4"
	"syncopate/websocket"
)

func SetupRoutes(e *echo.Echo) {
	e.GET("/ws", websocket.HandleWebSocket)
}