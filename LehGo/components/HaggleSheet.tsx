import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import Animated, { FadeInUp, SlideInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

interface HaggleSheetProps {
  visible: boolean;
  onClose: () => void;
  onRequest: (offer: string, vehicle: string, options: any) => void;
  title?: string;
  confirmText?: string;
}

export function HaggleSheet({
  visible,
  onClose,
  onRequest,
  title = "Let's Talk Price.",
  confirmText = "Send Offer",
}: HaggleSheetProps) {
  if (!visible) return null;

  const [price, setPrice] = useState(150);
  const [vehicle, setVehicle] = useState("Bike");
  const [acEnabled, setAcEnabled] = useState(false);

  // Simple price stepper
  const adjustPrice = (amount: number) => {
    setPrice((prev) => Math.max(50, prev + amount));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(15)}
      style={styles.sheet}
    >
      <View style={styles.handle} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close-circle" size={28} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Vehicle Selector */}
      <View style={styles.vehicleRow}>
        {["Bike", "Keke", "Taxi"].map((v) => (
          <TouchableOpacity
            key={v}
            style={[
              styles.vehicleOption,
              vehicle === v && styles.vehicleSelected,
            ]}
            onPress={() => {
              setVehicle(v);
              Haptics.selectionAsync();
            }}
          >
            <Ionicons
              name={
                v === "Bike" ? "bicycle" : v === "Keke" ? "car-sport" : "car"
              }
              size={24}
              color={vehicle === v ? "#1A1A1A" : "#FFCC00"}
            />
            <Text
              style={[
                styles.vehicleText,
                vehicle === v && styles.vehicleTextSelected,
              ]}
            >
              {v}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Options */}
      {vehicle === "Taxi" && (
        <TouchableOpacity
          style={[styles.optionRow, acEnabled && styles.optionSelected]}
          onPress={() => {
            setAcEnabled(!acEnabled);
            Haptics.selectionAsync();
          }}
        >
          <Ionicons
            name="snow"
            size={20}
            color={acEnabled ? "#1A1A1A" : "#DDD"}
          />
          <Text
            style={[styles.optionText, acEnabled && styles.optionTextSelected]}
          >
            AC Required
          </Text>
          {acEnabled && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#1A1A1A"
              style={{ marginLeft: "auto" }}
            />
          )}
        </TouchableOpacity>
      )}

      {/* Price Haggle Dial */}
      <View style={styles.haggleContainer}>
        <Text style={styles.currencyLabel}>YOUR OFFER (LRD)</Text>
        <View style={styles.priceControl}>
          <TouchableOpacity
            style={styles.adjustBtn}
            onPress={() => adjustPrice(-10)}
          >
            <Ionicons name="remove" size={32} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.priceDisplay}>{price}</Text>

          <TouchableOpacity
            style={styles.adjustBtn}
            onPress={() => adjustPrice(10)}
          >
            <Ionicons name="add" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.avgPrice}>
          Avg for this route: LRD {price + 50}
        </Text>
      </View>

      {/* Send Offer Button */}
      <TouchableOpacity
        style={styles.sendButton}
        activeOpacity={0.8}
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onRequest(price.toString(), vehicle, { ac: acEnabled });
        }}
      >
        <LinearGradient
          colors={["#FFCC00", "#FFB300"]}
          style={styles.sendGradient}
        >
          <Text style={styles.sendText}>{confirmText}</Text>
          <Ionicons
            name="paper-plane"
            size={20}
            color="#1A1A1A"
            style={{ marginLeft: 8 }}
          />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    width: width,
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#444",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "Outfit_900Black",
    color: "#FFF",
    letterSpacing: -0.5,
  },
  vehicleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  vehicleOption: {
    width: "31%",
    backgroundColor: "#333",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  vehicleSelected: {
    backgroundColor: "#FFCC00",
    borderColor: "#FFCC00",
  },
  vehicleText: {
    marginTop: 8,
    color: "#FFCC00",
    fontFamily: "Outfit_700Bold",
    fontSize: 14,
  },
  vehicleTextSelected: {
    color: "#1A1A1A",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#444",
  },
  optionSelected: {
    backgroundColor: "#FFCC00",
    borderColor: "#FFCC00",
  },
  optionText: {
    marginLeft: 10,
    color: "#DDD",
    fontFamily: "Outfit_500Medium",
    fontSize: 16,
  },
  optionTextSelected: {
    color: "#1A1A1A",
  },
  haggleContainer: {
    alignItems: "center",
    marginBottom: 32,
    backgroundColor: "#252525",
    padding: 20,
    borderRadius: 24,
  },
  currencyLabel: {
    color: "#666",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
    letterSpacing: 1,
  },
  priceControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  adjustBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  priceDisplay: {
    fontSize: 48,
    fontFamily: "Outfit_700Bold",
    color: "#FFF",
    letterSpacing: -1,
  },
  avgPrice: {
    marginTop: 8,
    color: "#666",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  sendButton: {
    height: 64,
    borderRadius: 20,
    overflow: "hidden",
  },
  sendGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sendText: {
    fontSize: 20,
    fontFamily: "Outfit_700Bold",
    color: "#1A1A1A",
  },
});
