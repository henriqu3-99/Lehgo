package api

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/rgt/lehgo-backend/internal/database"
	"github.com/rgt/lehgo-backend/internal/models"
	"github.com/rgt/lehgo-backend/internal/mqtt"
)

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Insert into DB
	err := database.DB.QueryRow(context.Background(),
		"INSERT INTO users (phone, name, role, last_lat, last_long) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at",
		user.Phone, user.Name, user.Role, user.LastLat, user.LastLong).Scan(&user.ID, &user.CreatedAt)

	if err != nil {
		http.Error(w, "Failed to create user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func CreateRide(w http.ResponseWriter, r *http.Request) {
	var ride models.Ride
	if err := json.NewDecoder(r.Body).Decode(&ride); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := database.DB.QueryRow(context.Background(),
		"INSERT INTO rides (rider_id, pickup_address, dropoff_address, pickup_lat, pickup_long, dropoff_lat, dropoff_long, vehicle_type, price, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'requested') RETURNING id, created_at",
		ride.RiderID, ride.PickupAddress, ride.DropoffAddress, ride.PickupLat, ride.PickupLong, ride.DropoffLat, ride.DropoffLong, ride.VehicleType, ride.Price).Scan(&ride.ID, &ride.CreatedAt)

	if err != nil {
		http.Error(w, "Failed to create ride: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if err != nil {
		http.Error(w, "Failed to create ride: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 1. Find Drivers within 5km
	drivers, _ := database.GetDriversNearby(ride.PickupLat, ride.PickupLong, 5.0)

	// 2. Publish to specific drivers (Targeted Matching)
	payload, _ := json.Marshal(ride)

	if len(drivers) > 0 {
		for _, d := range drivers {
			topic := "driver/" + strconv.Itoa(d.ID) + "/requests"
			mqtt.Publish(topic, payload)
		}
	} else {
		// Fallback: If no nearby drivers, maybe broadcast global or expand radius?
		// For prototype, we keep global broadcast as safety net or just log
		mqtt.Publish("rides/request/global", payload)
	}

	json.NewEncoder(w).Encode(ride)
}

func CreateBid(w http.ResponseWriter, r *http.Request) {
	var bid models.Bid
	if err := json.NewDecoder(r.Body).Decode(&bid); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := database.DB.QueryRow(context.Background(),
		"INSERT INTO bids (ride_id, driver_id, amount, status) VALUES ($1, $2, $3, 'pending') RETURNING id, created_at",
		bid.RideID, bid.DriverID, bid.Amount).Scan(&bid.ID, &bid.CreatedAt)

	if err != nil {
		http.Error(w, "Failed to create bid: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Publish to MQTT
	payload, _ := json.Marshal(bid)
	mqtt.Publish("rides/bids/global", payload)

	json.NewEncoder(w).Encode(bid)
}

func GetNearbyDrivers(w http.ResponseWriter, r *http.Request) {
	latStr := r.URL.Query().Get("lat")
	longStr := r.URL.Query().Get("long")

	lat, err1 := strconv.ParseFloat(latStr, 64)
	long, err2 := strconv.ParseFloat(longStr, 64)

	if err1 != nil || err2 != nil {
		http.Error(w, "Invalid lat/long", http.StatusBadRequest)
		return
	}

	drivers, err := database.GetDriversNearby(lat, long, 5.0) // 5km radius
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(drivers)
}
