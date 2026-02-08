# LehGo 🇱🇷

> **Liberia's Premium Ride-Sharing Platform.**

LehGo is a modern ride-sharing solution tailored for the Liberian market, designed to connect riders with Cars, **Kekehs**, and **Pen-Pens** through a seamless, real-time mobile interface.

---

## 🏗 Built for Liberia

LehGo isn't just another ride-hailing app; it's engineered specifically for the local context.

- **🤑 The Haggle Engine**: Negotiate fair prices in real-time. Drivers can counter-offer, and riders can accept or decline, mimicking the traditional bargaining culture.
- **🛺 All Vehicle Types**: Full support for the unique transport ecosystem:
  - **Cars** (Taxi / Private)
  - **Kekehs** (Tricycles)
  - **Pen-Pens** (Motorbikes)
- **⚡ Low-Data Optimization**: Uses **MQTT** for lightweight, real-time communication, ensuring the app performs reliably even on 2G/3G networks.
- **📍 Local Address Handling**: Optimized for local landmarks and dynamic location sharing.

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

The backend leverages **PostGIS** to perform efficient spatial queries, such as "find all Kekehs within 2km of this pickup point."

---

## 🤝 Contributing

We welcome contributions! Please see the individual `README.md` files in each directory for specific development guidelines.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
