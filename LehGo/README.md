# LehGo Mobile App 🇱🇷

The Premium Ride-Sharing Experience for Liberia. Built with React Native & Expo.

## 📱 Stack

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based routing)
- **Maps**: `react-native-maps`
- **State/Network**: `fetch` API + MQTT (WebSockets)

## 🛠 Setup

### Prerequisites

1.  Node.js (v18+) and npm/bun
2.  Expo Go app on your physical device OR iOS/Android Simulator

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Check `services/api.ts` to ensure the API URL points to your backend.

- **Simulator**: `http://localhost:8080`
- **Physical Device**: Replace `localhost` with your computer's LAN IP (e.g. `192.168.1.5`).

### 3. Run the App

```bash
npm run ios     # For iOS Simulator
npm run android # For Android Emulator
npm start       # To connect via QR code (Real Device)
```

## 📂 Project Structure

- `app/`: Screens and Routing (Expo Router).
  - `(tabs)/`: Main Rider Interface (Home, Activity, Profile).
  - `driver/`: Driver Command Center.
  - `onboarding/`: Auth Flow (Phone -> OTP -> Profile).
- `components/`: Reusable UI elements (Buttons, MapBackground, HaggleSheet).
- `services/`: API and MQTT clients.
- `assets/`: Images and Fonts.

## ✨ Key Features

- **Smart Phone Input**: Auto-formats Liberian numbers (+231).
- **Real-Time Bidding**: "Haggle Engine" allows drivers to counter-offer.
- **Live Tracking**: Integrates with device GPS.
- **Offline First UI**: Graceful handling of network states.

## 🚀 Building for Production

Prebuild the native directories:

```bash
npx expo prebuild
```

Then build via Xcode/Android Studio or EAS Build.
