package main

import (
	"net/http"
	"syncopate/configs"
	"syncopate/routes"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

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

	e.Logger.Fatal(e.Start(":8000"))
}
