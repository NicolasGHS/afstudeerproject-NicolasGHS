package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Instrument struct {
	Id   primitive.ObjectID `json:"id,omitempty"`
	Name string             `json:"name,omitempty" validate:"required"`
}
