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

var InstrumentCollection *mongo.Collection = configs.GetCollection(configs.DB, "instruments")
var validateInstrument = validator.New()

func CreateInstrument(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var instrument models.Instrument
	defer cancel()

	// validate the request body
	if err := c.Bind(&instrument); err != nil {
		return c.JSON(http.StatusBadRequest, responses.InstrumentResponse{Status: http.StatusBadRequest, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	if validationErr := validateInstrument.Struct(&instrument); validationErr != nil {
		return c.JSON(http.StatusBadRequest, responses.InstrumentResponse{Status: http.StatusBadRequest, Message: "error", Data: &echo.Map{"data": validationErr.Error()}})
	}

	newInstrument := models.Instrument{
		Id:   primitive.NewObjectID(),
		Name: instrument.Name,
	}

	result, err := InstrumentCollection.InsertOne(ctx, newInstrument)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.InstrumentResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusCreated, responses.InstrumentResponse{Status: http.StatusCreated, Message: "success", Data: &echo.Map{"data": result}})
}

func GetInstrument(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	instrumentId := c.Param("instrumentId")
	var instrument models.Instrument
	defer cancel()

	objId, _ := primitive.ObjectIDFromHex(instrumentId)

	err := InstrumentCollection.FindOne(ctx, bson.M{"id": objId}).Decode(&instrument)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.InstrumentResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	return c.JSON(http.StatusOK, responses.InstrumentResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": instrument}})
}

func GetAllInstruments(c echo.Context) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var instruments []models.Instrument
	defer cancel()

	results, err := InstrumentCollection.Find(ctx, bson.M{})

	if err != nil {
		return c.JSON(http.StatusInternalServerError, responses.InstrumentResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
	}

	// reading from db
	defer results.Close(ctx)
	for results.Next(ctx) {
		var singleInstrument models.Instrument
		if err = results.Decode(&singleInstrument); err != nil {
			return c.JSON(http.StatusInternalServerError, responses.InstrumentResponse{Status: http.StatusInternalServerError, Message: "error", Data: &echo.Map{"data": err.Error()}})
		}

		instruments = append(instruments, singleInstrument)
	}

	return c.JSON(http.StatusOK, responses.InstrumentResponse{Status: http.StatusOK, Message: "success", Data: &echo.Map{"data": instruments}})

}
