package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Notification struct {
	Id          primitive.ObjectID `bson:"_id,omitempty"`
	UserId      string             `bson:"userId"`
	Message     string             `bson:"message"`
	IsDelivered bool               `bson:"isDelivered"`
	CreatedAt   primitive.DateTime `bson:"createdAt"`
}
