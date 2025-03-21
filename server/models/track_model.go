package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Track struct {
	Id           primitive.ObjectID `json:"id,omitempty"`
	Name         string             `json:"name,omitempty" validate:"required"`
	UserId       string             `json:"userId,omitempty" validate:"required"`
	Key          string             `json:"key,omitempty" validate:"required"`
	Bpm          int32              `json:"bpm,omitempty" validate:"required"`
	Genre        string             `json:"genre,omitempty" validate:"required"`
	Contributors []string           `json:"contributors,omitempty"`
	// Track  string             `json:"track,omitempty" validate:"required"`
	// Instruments []string           `json:"instruments,omitempty" validate:"required"`
	// Request     []string           `json:"request,omitempty" validate:"required"`
	CreatedAt time.Time `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
}
