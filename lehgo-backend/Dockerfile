# Build Stage
FROM golang:1.24-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o lehgo-server main.go

# Run Stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/lehgo-server .

EXPOSE 8080
EXPOSE 1883
EXPOSE 8083

CMD ["./lehgo-server"]
