import mqtt from "mqtt";
import { Platform } from "react-native";

const BROKER_URL =
  Platform.OS === "android"
    ? "ws://10.0.2.2:8083" // Android Emulator loopback
    : "ws://localhost:8083"; // iOS Simulator / Web

export class MQTTService {
  client: mqtt.MqttClient | null = null;
  private statusListeners: ((isConnected: boolean) => void)[] = [];
  isConnected: boolean = false;

  addStatusListener(callback: (isConnected: boolean) => void) {
    this.statusListeners.push(callback);
    callback(this.isConnected); // Immediate fire
    return () => {
      this.statusListeners = this.statusListeners.filter(
        (cb) => cb !== callback
      );
    };
  }

  private notifyListeners(status: boolean) {
    this.isConnected = status;
    this.statusListeners.forEach((cb) => cb(status));
  }

  connect() {
    if (this.client) return;

    console.log(`🔌 Connecting to MQTT Broker at ${BROKER_URL}...`);

    this.client = mqtt.connect(BROKER_URL, {
      clientId: `lehgo_rider_${Math.random().toString(16).substr(2, 8)}`,
      keepalive: 60,
      reconnectPeriod: 1000,
    });

    this.client.on("connect", () => {
      console.log("✅ MQTT Connected!");
      this.notifyListeners(true);
    });

    this.client.on("reconnect", () => {
      console.log("🔄 MQTT Reconnecting...");
      this.notifyListeners(false);
    });

    this.client.on("close", () => {
      console.log("🔌 MQTT Disconnected");
      this.notifyListeners(false);
    });

    this.client.on("error", (err) => {
      console.log("❌ MQTT Error:", err);
      // Don't kill the client, let it reconnect
    });

    this.client.on("message", (topic, message) => {
      console.log(`📩 Message [${topic}]: ${message.toString()}`);
    });
  }

  publishRequest(
    pickup: string,
    destination: string,
    vehicleType: string,
    price: string
  ) {
    if (!this.client?.connected) {
      console.log("⚠️ Cannot publish, client not connected.");
      return;
    }

    const payload = JSON.stringify({
      pickup,
      destination,
      vehicleType,
      price,
      ts: Date.now(),
    });

    const topic = "rides/request/global"; // Using global for now, will geo-hash later
    this.client.publish(topic, payload);
    console.log(`🚀 Published Request to ${topic}`);
  }

  publishBid(rideId: string, amount: string, driverName: string) {
    if (!this.client?.connected) return;

    const payload = JSON.stringify({
      rideId,
      amount,
      driverName,
      ts: Date.now(),
    });

    const topic = `rides/bid/${rideId}`; // In real app, this would be specific to the ride
    // For this prototype, we'll just broadcast to a general bidding topic or assume the rider listens to 'rides/bid/+'
    // Let's use a shared topic for simplicity in Prototype v1
    this.client.publish("rides/bids/global", payload);
    console.log(`💰 Published Bid: ${amount} for ${rideId}`);
  }
}

export const mqttService = new MQTTService();
