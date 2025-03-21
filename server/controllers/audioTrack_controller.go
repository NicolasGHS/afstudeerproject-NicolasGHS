package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"syncopate/configs"
	"syncopate/models"
	"syncopate/responses"
	"syncopate/socket"
	"time"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var audioTrackCollection *mongo.Collection = configs.GetCollection(configs.DB, "audioTracks")

// var validateAudioTrack = validator.New()

func CreateAudioTrack(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var audioTrack models.AudioTrack
	defer cancel()

	// validate the request body
	if err := c.Bind(&audioTrack); err != nil {
		return c.JSON(http.StatusBadRequest, responses.AudioTrackResponse{Status: http.StatusBadRequest, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	// use the validator to validate required fields
	if validationErr := validateTrack.Struct(&audioTrack); validationErr != nil {
		return c.JSON(http.StatusBadRequest, responses.AudioTrackResponse{Status: http.StatusBadRequest, Message: "error", Data: &echo.Map{"data": validationErr.Error()}})
	}

	newAudioTrack := models.AudioTrack{
		Id:          primitive.NewObjectID(),
		Name:        audioTrack.Name,
		Contributor: audioTrack.Contributor,
		TrackId:     audioTrack.TrackId,
		TrackUrl:    audioTrack.TrackUrl,
		Status:      "pending",
		Instrument:  audioTrack.Instrument,
	}

	result, err := audioTrackCollection.InsertOne(ctx, newAudioTrack)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.AudioTrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	trackID, err := primitive.ObjectIDFromHex(audioTrack.TrackId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, responses.AudioTrackResponse{
			Status:  http.StatusBadRequest,
			Message: "error",
			Data:    &echo.Map{"data": "Invalid TrackId format"},
		})
	}

	var parentTrack models.Track
	err = trackCollection.FindOne(ctx, bson.M{"id": trackID}).Decode(&parentTrack)

	if err != nil {
		return c.JSON(http.StatusNotFound, responses.AudioTrackResponse{
			Status:  http.StatusNotFound,
			Message: "error",
			Data:    &echo.Map{"data": "Parent track not found"},
		})
	}

	messageData := map[string]string{
		"message": "Je hebt een nieuw verzoek voor een AudioTrack!",
		"trackId": parentTrack.Id.Hex(), // Stuur de ID van de aangemaakte track
	}

	jsonMessage, err := json.Marshal(messageData)
	if err != nil {
		log.Println("Error bij JSON conversie:", err)
		return err
	}

	socket.NotifyUser(parentTrack.UserId, string(jsonMessage))

	return c.JSON(http.StatusCreated, responses.AudioTrackResponse{Status: http.StatusCreated, Message: "success", Data: &echo.Map{"data": result}})

}

func GetAudioTrack(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	AudioTrackId := c.Param("AudioTrackId")
	var AudioTrack models.AudioTrack
	defer cancel()

	objId, _ := primitive.ObjectIDFromHex(AudioTrackId)

	err := audioTrackCollection.FindOne(ctx, bson.M{"id": objId}).Decode(&AudioTrack)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.AudioTrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusOK, responses.AudioTrackResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": AudioTrack}})
}

// func EditAudioTrack(c echo.Context) error {
// 	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
// 	audioTrackId := c.Param("audioTrackId")
// 	var audioTrack models.AudioTrack
// 	defer cancel()
//
// 	objId, _ := primitive.ObjectIDFromHex(audioTrackId)
//
// 	// validate the request body
// 	if err := c.Bind(&audioTrack); err != nil {
// 		return c.JSON(http.StatusBadRequest, responses.AudioTrackResponse{Status: http.StatusBadRequest, Message: "error", Data: &echo.Map{"data": err.Error()}})
// 	}
//
// 	// use validator to validate required fields
//
// }

func DeleteAudioTrack(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	audioTrackId := c.Param("audioTrackId")
	defer cancel()

	objId, _ := primitive.ObjectIDFromHex(audioTrackId)

	result, err := audioTrackCollection.DeleteOne(ctx, bson.M{"id": objId})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.AudioTrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	if result.DeletedCount < 1 {
		return c.JSON(http.StatusNotFound, responses.AudioTrackResponse{Status: http.StatusNotFound, Message: "error", Data: &echo.Map{"data": "Audio Track with specified ID not found!"}})
	}

	return c.JSON(http.StatusOK, responses.AudioTrackResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": "Audio Track successfully deleted!"}})
}

func GetAllAudioTracks(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var audioTracks []models.AudioTrack
	defer cancel()

	results, err := audioTrackCollection.Find(ctx, bson.M{})

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.AudioTrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	// reading from db
	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleAudioTrack models.AudioTrack
		if err = results.Decode(&singleAudioTrack); err != nil {
			return c.JSON(http.StatusInternalServerError, responses.AudioTrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
		}

		audioTracks = append(audioTracks, singleAudioTrack)
	}

	return c.JSON(http.StatusOK, responses.AudioTrackResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": audioTracks}})

}

func AcceptAudioTracks(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Verkrijg de lijst van track IDs (bijv. van de frontend) die geaccepteerd moeten worden
	var requestBody struct {
		TrackIds []string `json:"trackIds"`
	}

	if err := c.Bind(&requestBody); err != nil {
		return c.JSON(http.StatusBadRequest, responses.AudioTrackResponse{Status: http.StatusBadRequest, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	// Zet de status van elke audio track op 'accepted'
	for _, trackId := range requestBody.TrackIds {
		trackObjectId, err := primitive.ObjectIDFromHex(trackId)
		if err != nil {
			return c.JSON(http.StatusBadRequest, responses.AudioTrackResponse{
				Status:  http.StatusBadRequest,
				Message: "error",
				Data:    &echo.Map{"data": "Invalid TrackId format"},
			})
		}

		// Haal de AudioTrack op
		var audioTrack models.AudioTrack
		err = audioTrackCollection.FindOne(ctx, bson.M{"id": trackObjectId}).Decode(&audioTrack)
		if err != nil {
			return c.JSON(http.StatusNotFound, responses.AudioTrackResponse{
				Status:  http.StatusNotFound,
				Message: "error",
				Data:    &echo.Map{"data": "AudioTrack not found"},
			})
		}

		update := bson.M{"$set": bson.M{"status": "accepted"}}
		_, err = audioTrackCollection.UpdateOne(ctx, bson.M{"id": trackObjectId}, update)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, responses.AudioTrackResponse{
				Status:  http.StatusInternalServerError,
				Message: "error",
				Data:    &echo.Map{"data": err.Error()},
			})
		}

		// Zoek de parent Track op
		parentTrackId, err := primitive.ObjectIDFromHex(audioTrack.TrackId)
		if err != nil {
			return c.JSON(http.StatusBadRequest, responses.AudioTrackResponse{
				Status:  http.StatusBadRequest,
				Message: "error",
				Data:    &echo.Map{"data": "Invalid Parent TrackId format"},
			})
		}

		var parentTrack models.Track
		err = trackCollection.FindOne(ctx, bson.M{"id": parentTrackId}).Decode(&parentTrack)
		if err != nil {
			return c.JSON(http.StatusNotFound, responses.AudioTrackResponse{
				Status:  http.StatusNotFound,
				Message: "error",
				Data:    &echo.Map{"data": "Parent track not found"},
			})
		}

		// Controleer of de contributor al in de lijst staat
		exists := false
		for _, contributor := range parentTrack.Contributors {
			if contributor == audioTrack.Contributor {
				exists = true
				break
			}
		}

		// Voeg de contributor toe als deze nog niet bestaat
		if !exists {
			updateParentTrack := bson.M{"$addToSet": bson.M{"contributors": audioTrack.Contributor}}
			_, err = trackCollection.UpdateOne(ctx, bson.M{"id": parentTrackId}, updateParentTrack)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, responses.AudioTrackResponse{
					Status:  http.StatusInternalServerError,
					Message: "error",
					Data:    &echo.Map{"data": err.Error()},
				})
			}
		}
	}

	return c.JSON(http.StatusOK, responses.AudioTrackResponse{
		Status:  http.StatusOK,
		Message: "success",
		Data:    &echo.Map{"data": "Tracks successfully accepted"},
	})
}

func DeclineAudioTracks(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var requestBody struct {
		TrackIds []string `json:"trackIds"`
	}

	if err := c.Bind(&requestBody); err != nil {
		return c.JSON(http.StatusBadRequest, responses.AudioTrackResponse{
			Status:  http.StatusBadRequest,
			Message: "error",
			Data:    &echo.Map{"data": err.Error()},
		})
	}

	// Loop door alle track IDs en verwijder ze uit de database
	for _, trackId := range requestBody.TrackIds {
		fmt.Println("Deleting track ID:", trackId)

		// Controleer of de trackId een geldig ObjectID is
		trackObjectId, err := primitive.ObjectIDFromHex(trackId)
		if err != nil {
			fmt.Println("Invalid ObjectID format, using string match instead")
			filter := bson.M{"trackId": trackId} // Gebruik string match als fallback
			res, err := audioTrackCollection.DeleteOne(ctx, filter)
			if err != nil {
				fmt.Println("MongoDB DeleteOne error:", err)
				return c.JSON(http.StatusInternalServerError, responses.AudioTrackResponse{
					Status:  http.StatusInternalServerError,
					Message: "error",
					Data:    &echo.Map{"data": err.Error()},
				})
			}
			fmt.Println("Documents deleted (string ID):", res.DeletedCount)
			continue
		}

		// Verwijder met ObjectID als het geldig is
		filter := bson.M{"id": trackObjectId}
		res, err := audioTrackCollection.DeleteOne(ctx, filter)
		if err != nil {
			fmt.Println("MongoDB DeleteOne error:", err)
			return c.JSON(http.StatusInternalServerError, responses.AudioTrackResponse{
				Status:  http.StatusInternalServerError,
				Message: "error",
				Data:    &echo.Map{"data": err.Error()},
			})
		}

		fmt.Println("Documents deleted (ObjectID):", res.DeletedCount)
	}

	return c.JSON(http.StatusOK, responses.AudioTrackResponse{
		Status:  http.StatusOK,
		Message: "success",
		Data:    &echo.Map{"data": "Tracks successfully declined and deleted"},
	})
}
