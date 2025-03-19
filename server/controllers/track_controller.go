package controllers

import (
	"context"
	"net/http"
	"syncopate/configs"
	"syncopate/models"
	"syncopate/responses"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var trackCollection *mongo.Collection = configs.GetCollection(configs.DB, "tracks")

// var audioTrackCollection *mongo.Collection = configs.GetCollection(configs.DB, "audioTracks")
var validateTrack = validator.New()

func CreateTrack(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var track models.Track
	defer cancel()

	// validate the request body
	if err := c.Bind(&track); err != nil {
		return c.JSON(http.StatusBadRequest, responses.TrackResponse{Status: http.StatusBadRequest, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	// use the validator to validate required fields
	if validationErr := validateTrack.Struct(&track); validationErr != nil {
		return c.JSON(http.StatusBadRequest, responses.TrackResponse{Status: http.StatusBadRequest, Message: "error", Data: &echo.Map{"data": validationErr.Error()}})
	}

	newTrack := models.Track{
		Id:     primitive.NewObjectID(),
		Name:   track.Name,
		UserId: track.UserId,
		Key:    track.Key,
		Bpm:    track.Bpm,
		Genre:  track.Genre,
		// Track:  track.Track,
		// Instruments: track.Instruments,
	}

	result, err := trackCollection.InsertOne(ctx, newTrack)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.TrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusCreated, responses.TrackResponse{Status: http.StatusCreated, Message: "success", Data: &echo.Map{"id": newTrack.Id.Hex(), "track": newTrack, "insertedId": result.InsertedID}})
}

func GetTrack(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	trackId := c.Param("trackId")
	var track models.Track
	defer cancel()

	objId, _ := primitive.ObjectIDFromHex(trackId)

	err := trackCollection.FindOne(ctx, bson.M{"id": objId}).Decode(&track)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.TrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusOK, responses.TrackResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": track}})
}

func EditTrack(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	trackId := c.Param("trackId")
	var track models.Track
	defer cancel()

	objId, _ := primitive.ObjectIDFromHex(trackId)

	// validate the request body
	if err := c.Bind(&track); err != nil {
		return c.JSON(http.StatusBadRequest, responses.TrackResponse{Status: http.StatusBadRequest, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	// use validator to validate required fields
	if validationErr := validateTrack.Struct(&track); validationErr != nil {
		return c.JSON(http.StatusBadRequest, responses.TrackResponse{Status: http.StatusBadRequest, Message: "error", Data: &echo.Map{"data": validationErr.Error()}})
	}

	update := bson.M{"name": track.Name, "key": track.Key, "bpm": track.Bpm, "genre": track.Genre}
	result, err := trackCollection.UpdateOne(ctx, bson.M{"id": objId}, bson.M{"$set": update})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.TrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	// get updated track details
	var updatedTrack models.Track
	if result.MatchedCount == 1 {
		err := trackCollection.FindOne(ctx, bson.M{"id": objId}).Decode(&updatedTrack)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, responses.TrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
		}
	}

	return c.JSON(http.StatusOK, responses.TrackResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": updatedTrack}})
}

func DeleteTrack(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	trackId := c.Param("trackId")
	defer cancel()

	objId, _ := primitive.ObjectIDFromHex(trackId)

	result, err := trackCollection.DeleteOne(ctx, bson.M{"id": objId})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.TrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	if result.DeletedCount < 1 {
		return c.JSON(http.StatusNotFound, responses.TrackResponse{Status: http.StatusNotFound, Message: "error", Data: &echo.Map{"data": "Track with specified ID not found!"}})
	}

	return c.JSON(http.StatusOK, responses.TrackResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": "Track successfully deleted!"}})
}

func GetAllTracks(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var tracks []models.Track
	defer cancel()

	results, err := trackCollection.Find(ctx, bson.M{})

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.TrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	// reading from db
	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleTrack models.Track
		if err = results.Decode(&singleTrack); err != nil {
			return c.JSON(http.StatusInternalServerError, responses.TrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
		}

		tracks = append(tracks, singleTrack)
	}

	return c.JSON(http.StatusOK, responses.TrackResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": tracks}})

}

func GetAcceptedAudioTrackByTrackId(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	trackId := c.Param("trackId")
	defer cancel()

	// Zet de trackId om naar ObjectID
	// objId, err := primitive.ObjectIDFromHex(trackId)
	// if err != nil {
	// 	return c.JSON(http.StatusBadRequest, responses.TrackResponse{
	// 		Status:  http.StatusBadRequest,
	// 		Message: "error",
	// 		Data:    &echo.Map{"data": "Invalid trackId format"},
	// 	})
	// }

	// Zoek naar alle audioTracks met de juiste trackId
	var audioTracks []models.AudioTrack
	cursor, err := audioTrackCollection.Find(ctx, bson.M{
		"trackid": trackId,
		"status":  "accepted",
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.TrackResponse{
			Status:  http.StatusInternalServerError,
			Message: "error",
			Data:    &echo.Map{"data": err.Error()},
		})
	}

	// Lees resultaten uit de cursor
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var audioTrack models.AudioTrack
		if err := cursor.Decode(&audioTrack); err != nil {
			return c.JSON(http.StatusInternalServerError, responses.TrackResponse{
				Status:  http.StatusInternalServerError,
				Message: "error",
				Data:    &echo.Map{"data": err.Error()},
			})
		}
		audioTracks = append(audioTracks, audioTrack)
	}

	return c.JSON(http.StatusOK, responses.TrackResponse{
		Status:  http.StatusOK,
		Message: "success",
		Data:    &echo.Map{"data": audioTracks},
	})

}

func GetAllAudioTracksByTrackId(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	trackId := c.Param("trackId")
	defer cancel()

	var audioTracks []models.AudioTrack

	// Zoek alle audiotracks met de opgegeven TrackId (zonder filtering op status)
	cursor, err := audioTrackCollection.Find(ctx, bson.M{"trackid": trackId})

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.AudioTrackResponse{
			Status:  http.StatusInternalServerError,
			Message: "error",
			Data:    &echo.Map{"data": err.Error()},
		})
	}

	// Itereer door de resultaten
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var track models.AudioTrack
		if err := cursor.Decode(&track); err != nil {
			return c.JSON(http.StatusInternalServerError, responses.AudioTrackResponse{
				Status:  http.StatusInternalServerError,
				Message: "error",
				Data:    &echo.Map{"data": err.Error()},
			})
		}
		audioTracks = append(audioTracks, track)
	}

	return c.JSON(http.StatusOK, responses.AudioTrackResponse{
		Status:  http.StatusOK,
		Message: "success",
		Data:    &echo.Map{"data": audioTracks},
	})
}
