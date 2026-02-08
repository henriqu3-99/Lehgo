package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"github.com/rgt/lehgo-backend/internal/api"
	"github.com/rgt/lehgo-backend/internal/auth"
	"github.com/rgt/lehgo-backend/internal/database"
	"github.com/rgt/lehgo-backend/internal/mqtt"
)

func main() {
	// Load .env
	_ = godotenv.Load() // Ignore error in prod/docker if env vars set differently

	// Initialize Database
	database.Connect()

	// Start MQTT Broker in a goroutine
	go mqtt.StartBroker()

	// Router Setup
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"}, // Debug only
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type"},
	}))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("LehGo Backend API v1 🇱🇷"))
	})

	// Auth
	r.Post("/auth/send-otp", auth.SendOTP)
	r.Post("/auth/verify-otp", auth.VerifyOTP)

	// API
	r.Post("/users", api.CreateUser)
	r.Post("/rides", api.CreateRide)
	r.Post("/bids", api.CreateBid)
	r.Get("/drivers/nearby", api.GetNearbyDrivers)

	// Start HTTP API
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 HTTP API starting on port %s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}
