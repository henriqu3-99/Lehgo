package models

import "time"

type User struct {
	ID        int       `json:"id"`
	Phone     string    `json:"phone"`
	Name      string    `json:"name"`
	Role      string    `json:"role"`
	LastLat   float64   `json:"last_lat"`
	LastLong  float64   `json:"last_long"`
	CreatedAt time.Time `json:"created_at"`
}

type Ride struct {
	ID             int       `json:"id"`
	RiderID        int       `json:"rider_id"`
	PickupAddress  string    `json:"pickup_address"`
	DropoffAddress string    `json:"dropoff_address"`
	PickupLat      float64   `json:"pickup_lat"`
	PickupLong     float64   `json:"pickup_long"`
	DropoffLat     float64   `json:"dropoff_lat"`
	DropoffLong    float64   `json:"dropoff_long"`
	VehicleType    string    `json:"vehicle_type"`
	Status         string    `json:"status"`
	Price          float64   `json:"price"`
	CreatedAt      time.Time `json:"created_at"`
}

type Bid struct {
	ID        int       `json:"id"`
	RideID    int       `json:"ride_id"`
	DriverID  int       `json:"driver_id"`
	Amount    float64   `json:"amount"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}
