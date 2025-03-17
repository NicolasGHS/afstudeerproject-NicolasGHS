package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AudioTrack struct {
	Id          primitive.ObjectID `json:"id,omitempty"`
	Name        string             `json:"name,omitempty" validate:"required"`
	Contributor string             `json:"contributor,omitempty" validate:"required"`
	TrackId     string             `json:"trackId,omitempty" validate:"required"`
	TrackUrl    string             `json:"trackUrl,omitempty" validate:"required"`
	Instrument  string             `json:"instrument,omitempty" validate:"required"`
	CreatedAt   time.Time          `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
}
