import { Platform } from "react-native";

// Use localhost for iOS simulator, or specific IP for physical device
// const API_URL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
const API_URL = "http://localhost:8080"; // Defaulting for iOS sim

export const api = {
  async createUser(
    phone: string,
    name: string,
    role: string,
    lat: number = 0,
    long: number = 0
  ) {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          name,
          role,
          last_lat: lat,
          last_long: long,
        }),
      });
      return await res.json();
    } catch (e) {
      console.error("API Error (CreateUser):", e);
      return null;
    }
  },

  async createRide(
    riderId: number,
    pickup: string,
    dropoff: string,
    pickupLat: number,
    pickupLong: number,
    dropoffLat: number,
    dropoffLong: number,
    vehicle: string,
    price: number
  ) {
    try {
      const res = await fetch(`${API_URL}/rides`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rider_id: riderId,
          pickup_address: pickup,
          dropoff_address: dropoff,
          pickup_lat: pickupLat,
          pickup_long: pickupLong,
          dropoff_lat: dropoffLat,
          dropoff_long: dropoffLong,
          vehicle_type: vehicle,
          price,
        }),
      });
      return await res.json();
    } catch (e) {
      console.error("API Error (CreateRide):", e);
      return null;
    }
  },

  async createBid(rideId: number, driverId: number, amount: number) {
    try {
      const res = await fetch(`${API_URL}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ride_id: rideId,
          driver_id: driverId,
          amount,
        }),
      });
      return await res.json();
    } catch (e) {
      console.error("API Error (CreateBid):", e);
      return null;
    }
  },

  async sendOTP(phone: string) {
    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      return await res.json();
    } catch (e) {
      console.error("API Error (SendOTP):", e);
      return null;
    }
  },

  async verifyOTP(phone: string, code: string) {
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      if (res.status === 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.error("API Error (VerifyOTP):", e);
      return false;
    }
  },
};
