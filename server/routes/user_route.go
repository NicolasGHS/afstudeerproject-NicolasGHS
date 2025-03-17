package routes

import (
	"syncopate/controllers"

	"github.com/labstack/echo/v4"
)

func UserRoute(e *echo.Echo) {
	e.GET("/users", controllers.GetAllUsers)
	e.GET("/users/:userId", controllers.GetUser)
	e.GET("/users/clerk/:clerkid", controllers.GetUserByClerkId)
	e.POST("/users", controllers.CreateUser)
	e.PUT("/users/:userId", controllers.EditUser)
	e.DELETE("/users/:userId", controllers.DeleteUser)
}
