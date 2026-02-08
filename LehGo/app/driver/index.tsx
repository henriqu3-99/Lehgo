import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { mqttService } from "@/services/mqtt";
import { api } from "@/services/api";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { NetworkStatus } from "@/components/NetworkStatus";
import { HaggleSheet } from "@/components/HaggleSheet";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

export default function DriverScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [activeRequestIndex, setActiveRequestIndex] = useState<number | null>(
    null
  );
  const [isCountering, setIsCountering] = useState(false);

  useEffect(() => {
    // Force connect just in case
    mqttService.connect();

    // Subscribe to requests
    // Subscribe to requests
    // mqttService.client?.subscribe("rides/request/global"); // Old Global
    mqttService.client?.subscribe("driver/2/requests"); // Targeted (Mock ID 2)
    mqttService.client?.subscribe("rides/request/global"); // Keep global for fallback logic if needed

    mqttService.client?.on("message", (topic, message) => {
      console.log("🚕 Driver received message:", topic, message.toString());
      // Accept both global and private topics
      if (topic.includes("rides/request") || topic.includes("driver/")) {
        const req = JSON.parse(message.toString());
        setRequests((prev) => [req, ...prev]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    });

    return () => {
      if (mqttService.client) {
        mqttService.client.unsubscribe("rides/request/global");
      }
    };
  }, []);

  const handleSendCounter = (price: string, vehicle: string, options: any) => {
    if (activeRequestIndex === null) return;

    setIsCountering(false);

    // Publish Bid via API
    api.createBid(
      requests[activeRequestIndex].id, // Ride ID from request
      2, // Mock Driver ID
      parseFloat(price)
    );

    alert(`✅ Counter Offer Sent: LRD ${price}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#101010", "#000000"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.brandTitle}>Command Center</Text>
          <NetworkStatus />
        </View>

        <View style={styles.placeholderIcon} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Earnings Card */}
        <Animated.View
          entering={FadeInDown.delay(200)}
          style={styles.earningsCard}
        >
          <LinearGradient
            colors={["#1F1F1F", "#151515"]}
            style={styles.earningsGradient}
          >
            <View>
              <Text style={styles.earningsLabel}>TODAY'S EARNINGS</Text>
              <Text style={styles.earningsValue}>LRD 4,500</Text>
            </View>
            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Ionicons name="speedometer" size={16} color="#00C853" />
                <Text style={styles.metricText}>8 Rides</Text>
              </View>
              <View style={styles.metric}>
                <Ionicons name="time" size={16} color="#FFCC00" />
                <Text style={styles.metricText}>4h 20m</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Text style={styles.sectionTitle}>
          Live Requests ({requests.length})
        </Text>

        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.radarPulse} />
            <Ionicons name="radio" size={48} color="#333" />
            <Text style={styles.emptyText}>Scanning for riders...</Text>
          </View>
        ) : (
          requests.map((req, index) => (
            <Animated.View
              entering={FadeInDown.duration(500)}
              key={index}
              style={styles.requestCard}
            >
              <View style={styles.reqHeader}>
                <View style={styles.riderInfo}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={20} color="#1A1A1A" />
                  </View>
                  <View>
                    <Text style={styles.riderName}>Guest Rider</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color="#FFCC00" />
                      <Text style={styles.ratingText}>4.8</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.priceTag}>
                  <Text style={styles.priceText}>LRD {req.price}</Text>
                </View>
              </View>

              <View style={styles.routeContainer}>
                <View
                  style={[styles.timelineDot, { backgroundColor: "#FFCC00" }]}
                />
                <Text style={styles.locationText}>{req.pickup}</Text>
              </View>
              <View style={styles.timelineLine} />
              <View style={styles.routeContainer}>
                <View
                  style={[styles.timelineDot, { backgroundColor: "#00C853" }]}
                />
                <Text style={styles.locationText}>{req.destination}</Text>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaBadge}>
                  <Ionicons name="car" size={14} color="#888" />
                  <Text style={styles.metaText}>{req.vehicleType}</Text>
                </View>
                {req.options?.ac && (
                  <View style={styles.metaBadge}>
                    <Ionicons name="snow" size={14} color="#00C853" />
                    <Text style={[styles.metaText, { color: "#00C853" }]}>
                      AC Req
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                    api.createBid(
                      req.id,
                      2, // Mock Driver ID
                      req.price
                    );
                    alert(`✅ Bid Sent!`);
                  }}
                >
                  <Text style={styles.acceptText}>ACCEPT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.counterButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    setActiveRequestIndex(index);
                    setIsCountering(true);
                  }}
                >
                  <Text style={styles.counterText}>COUNTER</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* Reusing HaggleSheet for Counter Offers */}
      <HaggleSheet
        visible={isCountering}
        onClose={() => setIsCountering(false)}
        onRequest={handleSendCounter}
        title="Your Counter Offer"
        confirmText="Send Counter"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  headerCenter: {
    alignItems: "center",
  },
  backButton: {
    padding: 8,
  },
  placeholderIcon: {
    width: 40,
  },
  brandTitle: {
    fontSize: 20,
    fontFamily: "Outfit_900Black",
    color: "#FFFFFF",
  },
  scrollContent: {
    padding: 20,
  },
  earningsCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#333",
  },
  earningsGradient: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  earningsLabel: {
    color: "#888",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
    letterSpacing: 1,
  },
  earningsValue: {
    color: "#FFF",
    fontSize: 32,
    fontFamily: "Outfit_700Bold",
    letterSpacing: -1,
  },
  metricsRow: {
    alignItems: "flex-end",
    gap: 8,
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  metricText: {
    color: "#CCC",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  sectionTitle: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Outfit_700Bold",
    marginBottom: 16,
    marginLeft: 4,
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
    gap: 16,
  },
  radarPulse: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#333",
    position: "absolute",
    top: -26,
  },
  emptyText: {
    color: "#444",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  requestCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  reqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  riderInfo: {
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFCC00",
    alignItems: "center",
    justifyContent: "center",
  },
  riderName: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Outfit_700Bold",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    color: "#BBB",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  priceTag: {
    backgroundColor: "rgba(0, 200, 83, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00C853",
  },
  priceText: {
    color: "#00C853",
    fontFamily: "Outfit_900Black",
    fontSize: 18,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    zIndex: 1,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: "#333",
    marginLeft: 5,
    marginVertical: 4,
  },
  locationText: {
    color: "#DDD",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#252525",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  metaText: {
    color: "#888",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: "#FFCC00",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  acceptText: {
    color: "#1A1A1A",
    fontFamily: "Outfit_900Black",
    fontSize: 14,
    letterSpacing: 1,
  },
  counterButton: {
    flex: 1,
    backgroundColor: "#333",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  counterText: {
    color: "#FFF",
    fontFamily: "Outfit_900Black",
    fontSize: 14,
    letterSpacing: 1,
  },
});
