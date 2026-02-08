package database

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func Connect() {
	var err error
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://postgres:postgres@localhost:5432/lehgo?sslmode=disable" // Default dev URL
	}

	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		log.Fatalf("Unable to parse DB config: %v\n", err)
	}

	DB, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}

	// Verify connection
	err = DB.Ping(context.Background())
	if err != nil {
		log.Fatalf("Unable to ping database: %v\n", err)
	}

	log.Println("✅ Connected to Postgres")

	// Auto-migrate schema for prototype speed (In prod, use migration files)
	createSchema()
}

func createSchema() {
	query := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		phone VARCHAR(20) UNIQUE NOT NULL,
		name VARCHAR(100),
		role VARCHAR(20) NOT NULL,
		last_lat FLOAT DEFAULT 0,
		last_long FLOAT DEFAULT 0,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS rides (
		id SERIAL PRIMARY KEY,
		rider_id INT REFERENCES users(id),
		pickup_address TEXT NOT NULL,
		dropoff_address TEXT NOT NULL,
		pickup_lat FLOAT DEFAULT 0,
		pickup_long FLOAT DEFAULT 0,
		dropoff_lat FLOAT DEFAULT 0,
		dropoff_long FLOAT DEFAULT 0,
		vehicle_type VARCHAR(20),
		status VARCHAR(20) DEFAULT 'requested',
		price DECIMAL(10, 2),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS bids (
		id SERIAL PRIMARY KEY,
		ride_id INT REFERENCES rides(id),
		driver_id INT REFERENCES users(id),
		amount DECIMAL(10, 2) NOT NULL,
		status VARCHAR(20) DEFAULT 'pending',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := DB.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to create schema: %v", err)
	}

	// Hot-fix migration for existing tables (prototype only hack)
	// In production, use a proper migration tool like 'migrate'
	migrateQuery := `
	ALTER TABLE users ADD COLUMN IF NOT EXISTS last_lat FLOAT DEFAULT 0;
	ALTER TABLE users ADD COLUMN IF NOT EXISTS last_long FLOAT DEFAULT 0;
	ALTER TABLE rides ADD COLUMN IF NOT EXISTS pickup_lat FLOAT DEFAULT 0;
	ALTER TABLE rides ADD COLUMN IF NOT EXISTS pickup_long FLOAT DEFAULT 0;
	ALTER TABLE rides ADD COLUMN IF NOT EXISTS dropoff_lat FLOAT DEFAULT 0;
	ALTER TABLE rides ADD COLUMN IF NOT EXISTS dropoff_long FLOAT DEFAULT 0;
	`
	_, _ = DB.Exec(context.Background(), migrateQuery)

	log.Println("✅ Database Schema Synced (Geo Enabled)")
}

type DriverLocation struct {
	ID       int
	Name     string
	Lat      float64
	Long     float64
	Distance float64
}

func GetDriversNearby(lat, long, radiusKm float64) ([]DriverLocation, error) {
	// Haversine formula
	// Simplified for Postgres:
	safeQuery := `
		SELECT id, name, last_lat, last_long,
		( 6371 * acos( cos( radians($1) ) * cos( radians( last_lat ) ) 
		* cos( radians( last_long ) - radians($2) ) + sin( radians($1) ) 
		* sin( radians( last_lat ) ) ) ) AS distance 
		FROM users 
		WHERE role = 'driver'
		AND ( 6371 * acos( cos( radians($1) ) * cos( radians( last_lat ) ) 
		* cos( radians( last_long ) - radians($2) ) + sin( radians($1) ) 
		* sin( radians( last_lat ) ) ) ) < $3
		ORDER BY distance 
		LIMIT 20;
	`

	rows, err := DB.Query(context.Background(), safeQuery, lat, long, radiusKm)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var drivers []DriverLocation
	for rows.Next() {
		var d DriverLocation
		if err := rows.Scan(&d.ID, &d.Name, &d.Lat, &d.Long, &d.Distance); err != nil {
			return nil, err
		}
		drivers = append(drivers, d)
	}
	return drivers, nil
}
