import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MapBackground } from "@/components/MapBackground";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { mqttService } from "@/services/mqtt";
import { api } from "@/services/api";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [destination, setDestination] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("Bike");

  useEffect(() => {
    mqttService.connect();

    // Listen for bids
    mqttService.client?.subscribe("rides/bids/global");
    mqttService.client?.on("message", (topic, message) => {
      if (topic === "rides/bids/global") {
        const bid = JSON.parse(message.toString());
        console.log("💰 Rider received bid:", bid);
        alert(`🔔 New Bid: LRD ${bid.amount} from ${bid.driverName}`);
      }
    });

    return () => {
      if (mqttService.client) {
        mqttService.client.unsubscribe("rides/bids/global");
      }
    };
  }, []);

  const handleRequest = async () => {
    // Get stored User ID
    const userIdStr = await AsyncStorage.getItem("userId");
    const userId = userIdStr ? parseInt(userIdStr) : 1; // Default to 1 if missing (dev mode)

    // Get Real Location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    // 1. Create Ride via API (which handles DB + MQTT broadcast)
    const ride = await api.createRide(
      userId,
      "Current Location", // In a real app, reverse geocode this lat/long to name
      destination || "Market",
      location.coords.latitude,
      location.coords.longitude,
      6.31,
      -10.8, // Mock Dropoff Lat/Long (still mocked for destination)
      selectedVehicle,
      50 // Mock initial price
    );

    if (ride) {
      alert(`📢 Request Sent! ID: ${ride.id}`);
    } else {
      alert("❌ Failed to request ride");
    }
  };

  return (
    <View style={styles.container}>
      <MapBackground />
      <StatusBar style="light" />

      {/* Header */}
      <SafeAreaView style={styles.header}>
        <Text style={styles.brandTitle}>LehGo</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#FFCC00" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom Sheet / Request Card */}
      <View style={styles.bottomCard}>
        <Text style={styles.greeting}>Where we going?</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter destination..."
            placeholderTextColor="#888"
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        {/* Vehicle Options - Quick Select */}
        <View style={styles.vehicleRow}>
          <VehicleOption
            name="Bike"
            icon="bicycle"
            price="50"
            selected={selectedVehicle === "Bike"}
            onPress={() => setSelectedVehicle("Bike")}
          />
          <VehicleOption
            name="Keke"
            icon="car-sport"
            price="100"
            selected={selectedVehicle === "Keke"}
            onPress={() => setSelectedVehicle("Keke")}
          />
          <VehicleOption
            name="Taxi"
            icon="car"
            price="250"
            selected={selectedVehicle === "Taxi"}
            onPress={() => setSelectedVehicle("Taxi")}
          />
        </View>

        {/* Audio Note Button */}
        <TouchableOpacity style={styles.audioButton} onPress={handleRequest}>
          <Ionicons name="radio" size={24} color="#1A1A1A" />
          <Text style={styles.audioButtonText}>Request Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function VehicleOption({
  name,
  icon,
  price,
  selected,
  onPress,
}: {
  name: string;
  icon: any;
  price: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.vehicleOption, selected && styles.vehicleOptionSelected]}
      onPress={onPress}
    >
      <Ionicons
        name={icon as any}
        size={24}
        color={selected ? "#1A1A1A" : "#FFCC00"}
      />
      <Text
        style={[styles.vehicleName, selected && styles.vehicleNameSelected]}
      >
        {name}
      </Text>
      <Text
        style={[styles.vehiclePrice, selected && styles.vehicleNameSelected]}
      >
        LRD {price}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFCC00", // Lagos Yellow
    letterSpacing: -1,
  },
  profileButton: {
    padding: 8,
  },
  bottomCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  vehicleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  vehicleOption: {
    width: "30%",
    backgroundColor: "#333",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  vehicleOptionSelected: {
    backgroundColor: "#FFCC00",
    borderColor: "#FFCC00",
  },
  vehicleName: {
    color: "#FFCC00",
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 12,
  },
  vehicleNameSelected: {
    color: "#1A1A1A",
  },
  vehiclePrice: {
    color: "#888",
    fontSize: 10,
    marginTop: 4,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFCC00",
    borderRadius: 50,
    height: 56,
  },
  audioButtonText: {
    color: "#1A1A1A",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 8,
  },
});
