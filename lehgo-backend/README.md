# LehGo Backend 🇱🇷

> **The High-Performance Go Backend for the LehGo Ride Sharing Platform.**  
> Handles user management, ride matching, and real-time location updates via MQTT.

---

## 🏗 Tech Stack

- **Language**: [Go (Golang)](https://go.dev/) 1.24+
- **Database**: [PostgreSQL](https://www.postgresql.org/) (with PostGIS for geospatial queries)
- **Real-Time Messaging**: Embedded MQTT Broker (using [`mochi-mqtt`](https://github.com/mochi-mqtt/server))
- **Containerization**: Docker & Docker Compose
- **Authentication**: Twilio (SMS OTP)

---

## 🚀 Getting Started

### Prerequisites

1.  **Go Workstation**: Go 1.24 or higher installed.
2.  **Database**: A PostgreSQL instance running on `localhost:5432`.
3.  **Twilio Account** (Optional for Dev): For real SMS OTPs.

### 1. Database Setup

Ensure you have a PostgreSQL database named `lehgo`.

```bash
createdb lehgo
```

The application will automatically migrate schema on startup (ensure your user has permissions).

### 2. Environment Configuration

Create a `.env` file in the `lehgo-backend` directory.

**Copy and paste this template:**

```env
# Server Configuration
PORT=8080
ENV=development

# Database Connection string: postgres://<user>:<password>@<host>:<port>/<dbname>?sslmode=disable
DATABASE_URL=postgres://postgres:postgres@localhost:5432/lehgo?sslmode=disable

# Authentication (Twilio)
# Leave these as placeholders if you just want to see OTPs in the console log
TWILIO_ACCOUNT_SID=AC_placeholder
TWILIO_AUTH_TOKEN=auth_token_placeholder
TWILIO_PHONE_NUMBER=+15555555555
```

### 3. Running Locally

```bash
# Install dependencies
go mod tidy

# Run the server
go run main.go
```

The server will start three services:

- **HTTP API**: `http://localhost:8080`
- **MQTT Broker (TCP)**: `localhost:1883`
- **MQTT over WebSockets**: `ws://localhost:8083` (Used by the Mobile App)

---

## 🐳 Running with Docker

You can run the entire backend (Server + DB) using Docker.

1.  **Build the image**:

    ```bash
    docker build -t lehgo-backend .
    ```

2.  **Run**:
    ```bash
    docker run -p 8080:8080 -p 1883:1883 -p 8083:8083 \
      -e DATABASE_URL=postgres://user:pass@host.docker.internal:5432/lehgo?sslmode=disable \
      lehgo-backend
    ```

_(A `docker-compose.yml` is recommended for linking the DB automatically - coming soon)._

---

## 🔌 API Reference

### Auth

- `POST /auth/send-otp`
  - Payload: `{ "phone": "+231777000000" }`
  - _Dev Note_: If Twilio credentials are invalid, the OTP will be printed to the server terminal.
- `POST /auth/verify-otp`
  - Payload: `{ "phone": "+231777000000", "code": "123456" }`

### Rides

- `POST /rides`
  - Creates a ride request and broadcasts it to drivers near the pickup location.
  - Payload:
    ```json
    {
      "rider_id": 1,
      "pickup_lat": 6.3156,
      "pickup_long": -10.8074,
      "pickup_address": "Broad St, Monrovia",
      "vehicle_type": "kekeh",
      "price": 150
    }
    ```

### Drivers

- `GET /drivers/nearby`
  - Query Params: `?lat=6.3156&long=-10.8074`
  - Returns drivers active within 5km radius.

---

## 📡 Real-Time Events (MQTT)

The app uses MQTT topics to sync state between Riders and Drivers.

- **Rider Topics**:
  - `rider/{rider_id}/updates`: Receive bid offers from drivers.
- **Driver Topics**:
  - `driver/{driver_id}/requests`: Receive new ride requests.
- **Global**:
  - `rides/global`: (Admin/Debug) Stream of all ride activity.

---

## 🛡 Security & Deployment

- **OTP**: In production, ensure `TWILIO_*` vars are set to real values.
- **SSL**: Run behind Nginx or Caddy with SSL termination for `wss://` (Secure WebSockets).
