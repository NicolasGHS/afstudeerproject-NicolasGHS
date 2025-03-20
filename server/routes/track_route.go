package routes

import (
	"syncopate/controllers"

	"github.com/labstack/echo/v4"
)

func TrackRoute(e *echo.Echo) {
	e.GET("/tracks", controllers.GetAllTracks)
	e.GET("/tracks/:trackId", controllers.GetTrack)
	e.GET("/tracks/audioTracks/:trackId", controllers.GetAcceptedAudioTrackByTrackId)
	e.GET("/tracks/allAudioTracks/:trackId", controllers.GetAllAudioTracksByTrackId)
	e.GET("/tracks/allPendingAudioTracks/:trackId", controllers.GetPendingAudioTrackByTrackId)
	e.POST("/tracks", controllers.CreateTrack)
	e.PUT("/tracks/:trackId", controllers.EditTrack)
	e.DELETE("/tracks/:trackId", controllers.DeleteTrack)
}
