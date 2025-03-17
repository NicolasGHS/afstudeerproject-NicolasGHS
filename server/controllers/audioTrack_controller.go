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

var audioTrackCollection *mongo.Collection = configs.GetCollection(configs.DB, "audioTracks")
var validateAudioTrack = validator.New()

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
		Instrument:  audioTrack.Instrument,
	}

	result, err := audioTrackCollection.InsertOne(ctx, newAudioTrack)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.AudioTrackResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

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


// func AcceptAudioTrack(w http.ResponseWriter, r*http.Request) {
// 	id := mux.Vars(r)["id"]
// 	ObjectID, _ := primitive.ObjectIDFromHex(id)

// 	update := bson.M{"$set": bson.M{"status": "accepted"}}
// 	_, err := audioTrackCollection.UpdateOne(context.TODO(), bson.M{"_id": ObjectId}, update)

// 	if err != nil {
// 		http.Error(w, "Failed to accept request", http.StatusInternalServerError)
//         return
// 	}

// 	w.WriteHeader(http.StatusOK)
// }

// func RejectAudioTrack(w http.ResponseWriter, r *http.Request) {
//     id := mux.Vars(r)["id"]
//     objectId, _ := primitive.ObjectIDFromHex(id)
    
//     update := bson.M{"$set": bson.M{"status": "rejected"}}
//     _, err := audioTrackCollection.UpdateOne(context.TODO(), bson.M{"_id": objectId}, update)

//     if err != nil {
//         http.Error(w, "Failed to reject request", http.StatusInternalServerError)
//         return
//     }
//     w.WriteHeader(http.StatusOK)
// }