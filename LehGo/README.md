# LehGo Mobile App 🇱🇷

> **The Premium Ride-Sharing Experience for Liberia.**  
> Built with React Native, Expo, and a Go backend.

LehGo connects riders with drivers in Liberia through a seamless, real-time mobile interface. It features a unique "Haggle Engine" for fair pricing, live tracking, and an offline-first architecture designed for local network conditions.

---

## 📱 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (via [Expo SDK 54](https://expo.dev/))
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Maps**: `react-native-maps` (Google Maps / Apple Maps integration)
- **State Management**: React Context & Hooks
- **Networking**: `fetch` API for REST & `mqtt` for real-time WebSockets
- **Styling**: StyleSheet API with custom theme constants

---

## ✨ Key Features

- **Auth Flow**: Phone number verification (OTP) with Liberian (+231) formatting auto-detection.
- **Rider Interface**:
  - **Map View**: Real-time driver visibility.
  - **Haggle Sheet**: Interactive bidding system for fair ride pricing.
  - **Activity History**: View past rides and status.
- **Driver Interface**: coming soon (structure prepared).
- **Offline Resilience**: Graceful UI handling when network connectivity drops.

---

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2.  **npm** or **bun** package manager.
3.  **Expo Go** app on your physical device (iOS/Android) OR:
    - **Xcode** (for iOS Simulator on Mac).
    - **Android Studio** (for Android Emulator).
4.  **Git**.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/henriqu3-99/LehGo.git
cd LehGo/LehGo  # Navigate to the frontend directory
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Configure Environment

The app connects to a backend server. By default, it points to `localhost:8080`.

**Important**: You must configure the API URL in `services/api.ts` based on your testing device:

- **iOS Simulator**: Use `http://localhost:8080` (Default).
- **Android Emulator**: Use `http://10.0.2.2:8080`.
- **Physical Device**: You **must** use your computer's local IP address (e.g., `http://192.168.1.5:8080`).
  - _Note_: Ensure your phone and computer are on the same Wi-Fi network.

**Edit `services/api.ts`:**

```typescript
// services/api.ts
import { Platform } from "react-native";

// Example configuration:
const API_URL = "http://192.168.1.X:8080"; // Replace X with your local IP for physical device testing
```

### 4. Run the Backend

Ensure the Go backend is running on port 8080 before starting the app.
(See `../lehgo-backend/README.md` for backend setup instructions).

### 5. Run the App

Start the Metro Bundler:

```bash
npm start
```

Then, follow the instructions in the terminal:

- Press **`i`** to open in **iOS Simulator**.
- Press **`a`** to open in **Android Emulator**.
- Scan the **QR code** with your phone's camera (iOS) or Expo Go app (Android) to run on a physical device.

---

## 📂 Project Structure

```text
LehGo/
├── app/                    # Expo Router pages (Navigation)
│   ├── (tabs)/             # Main Rider UI (Map, Activity, Profile)
│   ├── driver/             # Driver-specific screens
│   ├── onboarding/         # Auth screens (OTP, Profile setup)
│   ├── _layout.tsx         # Root layout & Theme provider
│   └── index.tsx           # Entry point (Redirects to Onboarding or Tabs)
├── assets/                 # Images, Fonts, and Icons
├── components/             # Reusable React components
│   ├── HaggleSheet.tsx     # The bidding interface bottom sheet
│   ├── MapBackground.tsx   # Map component wrapper
│   └── ui/                 # Small UI primitives (Icons, etc.)
├── constants/              # Theme configurations (Colors, Fonts)
├── hooks/                  # Custom React Hooks
├── services/               # API & External Service integrations
│   ├── api.ts              # REST API client (Fetch)
│   └── mqtt.ts             # MQTT Client for real-time data
└── scripts/                # Utility scripts (e.g., reset-project)
```

---

## 🧩 Troubleshooting

### "Network Request Failed"

- Ensure the backend is running on port 8080.
- If on a physical device, verify you are using your computer's LAN IP, not `localhost`.
- Check firewall settings on your computer to allow incoming connections on port 8080.

### "Metro Bundler Disconnected"

- Stop the server (Ctrl+C) and restart with `npx expo start -c` to clear the cache.

---

## 🤝 Contributing

1.  Create a feature branch (`git checkout -b feature/amazing-feature`).
2.  Commit your changes (`git commit -m 'Add some amazing feature'`).
3.  Push to the branch (`git push origin feature/amazing-feature`).
4.  Open a Pull Request.
