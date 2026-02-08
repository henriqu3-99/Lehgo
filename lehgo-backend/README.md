# LehGo Backend 🇱🇷

The High-Performance Go Backend for the LehGo Ride Sharing Platform.

## 🏗 Stack

- **Language**: Go (Golang) 1.24+
- **Database**: PostgreSQL (with PostGIS logic)
- **Real-Time**: MQTT (Embedded using `mochi-mqtt`)
- **Deployment**: Docker / Docker Compose

## 🚀 Quick Start

### Prerequisites

1.  Go 1.24+ installed
2.  PostgreSQL running on `localhost:5432`
3.  Database `lehgo` created

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Server
PORT=8080
DATABASE_URL=postgres://postgres:postgres@localhost:5432/lehgo?sslmode=disable

# Authentication (Twilio)
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### 2. Run Locally

```bash
go run main.go
```

The server will start on port `8080`.
MQTT Broker will start on port `1883` (TCP) and `8083` (WebSockets).

### 3. run via Docker

```bash
docker build -t lehgo-backend .
docker run -p 8080:8080 -p 1883:1883 -p 8083:8083 lehgo-backend
```

## 🔌 API Endpoints

### Authentication

- `POST /auth/send-otp`: Request an SMS code. Body: `{"phone": "+231777000000"}`
- `POST /auth/verify-otp`: Verify code. Body: `{"phone": "...", "code": "123456"}`

### Users & Rides

- `POST /users`: Create a new user.
- `POST /rides`: Request a new ride (broadcasts to nearby drivers).
- `GET /drivers/nearby?lat=...&long=...`: Get drivers within 5km.

### Real-Time (MQTT)

- **Global Requests**: `rides/request/global`
- **Driver Specific**: `driver/{id}/requests`

## 🛡 Security Notes (Phase 9)

- **OTP**: Uses Twilio for real SMS. Dev mode prints code to console if keys missing.
- **Data**: Inputs are assumed valid for MVP; production requires strict validation.
