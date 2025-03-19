package routes

import (
	"syncopate/controllers"

	"github.com/labstack/echo/v4"
)

func AudioTrackRoute(e *echo.Echo) {
	e.GET("/audioTracks", controllers.GetAllAudioTracks)
	e.GET("/audioTracks/:audioTrackId", controllers.GetAudioTrack)
	e.POST("/audioTracks", controllers.CreateAudioTrack)
	e.PUT("/audioTracks/accept", controllers.AcceptAudioTracks)
	e.DELETE("/audioTracks/:audioTrackId", controllers.DeleteAudioTrack)
}
