package configs

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func EnvMongoURI() string {
	// Probeer de environment variables te laden als ze niet zijn ingesteld
	if os.Getenv("MONGOURI") == "" {
		// Dit laad je alleen lokaal, niet op Render
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	mongoURI := os.Getenv("MONGOURI")
	if mongoURI == "" {
		log.Fatal("MONGOURI environment variable not set")
	}
	return mongoURI
}

func SessionKey() string {
	// Probeer de environment variables te laden als ze niet zijn ingesteld
	if os.Getenv("CLERK_SESSION_KEY") == "" {
		// Dit laad je alleen lokaal, niet op Render
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	sessionKey := os.Getenv("CLERK_SESSION_KEY")
	if sessionKey == "" {
		log.Fatal("CLERK_SESSION_KEY environment variable not set")
	}
	return sessionKey
}
