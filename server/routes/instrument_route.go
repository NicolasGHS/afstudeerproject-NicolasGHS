package routes

import (
	"syncopate/controllers"

	"github.com/labstack/echo/v4"
)

func InstrumentRoute(e *echo.Echo) {
	e.GET("/instruments", controllers.GetAllInstruments)
	e.GET("/instruments/:instrumentId", controllers.GetInstrument)
	e.POST("/instruments", controllers.CreateInstrument)
}
