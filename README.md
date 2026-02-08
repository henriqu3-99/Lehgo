# LehGo 🚗

> **A Modern, Scalable Ride-Sharing Platform.**

LehGo is a comprehensive ride-sharing solution designed for emerging markets, featuring a real-time mobile app for riders and drivers, and a high-performance backend system.

It is built to handle diverse vehicle types and unique market dynamics, such as price negotiation and low-bandwidth environments.

---

## 🏗 Key Features

LehGo is engineered to be flexible and robust:

- **🤑 The Haggle Engine**: Negotiate fair prices in real-time. Drivers can counter-offer, and riders can accept or decline, empowering users with pricing control.
- **🛺 Multi-Vehicle Support**: Designed to support various transport modes beyond just cars:
  - **Cars** (Taxi / Private)
  - **Auto-Rickshaws** (Tricycles / Tuk-Tuks)
  - **Motorbikes** (Moto-Taxis)
- **⚡ Low-Data Optimization**: Uses **MQTT** for lightweight, real-time communication, ensuring the app performs reliably even on 2G/3G networks.
- **📍 Dynamic Location Handling**: Optimized for regions where formal addresses may be inconsistent.

---

## 📂 Project Structure

This repository is a monorepo containing both the mobile application and the backend server.

- **[LehGo/](./LehGo/)**: The **Frontend** Mobile Application.
  - Built with **React Native** & **Expo**.
  - Runs on iOS and Android.
  - Handles User Interface, Maps, and Real-time Geolocation.

- **[lehgo-backend/](./lehgo-backend/)**: The **Backend** Server.
  - Built with **Go (Golang)**.
  - Manages Users, Rides, and Geospacial Data via PostGIS.
  - Hosts the **MQTT Broker** for real-time communication.

---

## 🚀 Quick Start Guide

To run the full stack locally, you will need to start both the backend and the frontend.

### 1. Start the Backend

```bash
cd lehgo-backend
# Follow the setup instructions in lehgo-backend/README.md
go run main.go
```

### 2. Start the Frontend

```bash
cd LehGo
# Follow the setup instructions in LehGo/README.md
npm start
```

---

## ARCHITECTURE

### Real-Time Communication

LehGo uses **MQTT** (Message Queuing Telemetry Transport) for efficient, low-latency communication between drivers, riders, and the server. This allows for real-time location tracking and instant ride offers even on slower mobile networks.

### Geolocation

The backend leverages **PostGIS** to perform efficient spatial queries, such as "find all drivers within 2km of this pickup point."

---

## 🤝 Contributing

We welcome contributions! Please see the individual `README.md` files in each directory for specific development guidelines.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
