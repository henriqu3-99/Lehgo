import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MapBackground } from "@/components/MapBackground";
import { NetworkStatus } from "@/components/NetworkStatus";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { mqttService } from "@/services/mqtt";
import { useRouter } from "expo-router";
import { HaggleSheet } from "@/components/HaggleSheet";
import Animated, {
  FadeInUp,
  FadeInDown,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [haggleVisible, setHaggleVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [bids, setBids] = useState<any[]>([]);

  useEffect(() => {
    // Listen for bids
    mqttService.client?.subscribe("rides/bids/global");
    mqttService.client?.on("message", (topic, message) => {
      if (topic === "rides/bids/global") {
        const bid = JSON.parse(message.toString());
        console.log("💰 Rider received bid:", bid);

        // Add bid to state
        setBids((prev) => [bid, ...prev]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    });

    return () => {
      if (mqttService.client) {
        mqttService.client.unsubscribe("rides/bids/global");
      }
    };
  }, []);

  const handleSendRequest = (price: string, vehicle: string, options: any) => {
    setHaggleVisible(false);
    setIsSearching(true);
    setBids([]); // Clear old bids

    mqttService.publishRequest(
      "Current Location",
      destination || "Market",
      vehicle,
      price
    );
  };

  const handleAcceptBid = (bid: any) => {
    alert(`✅ Ride Confirmed with ${bid.driverName}!`);
    setIsSearching(false);
    setBids([]);
  };

  // Searching Animation
  const RadarRipple = ({ delay }: { delay: number }) => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0.8);

    useEffect(() => {
      scale.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(4, { duration: 2000 })
        ),
        -1,
        false
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 0 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        false
      );
    }, []);

    const style = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    return <Animated.View style={[styles.ripple, style]} />;
  };

  return (
    <View style={styles.container}>
      <MapBackground />
      <StatusBar style="light" />

      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFCC00" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.brandTitle}>LehGo</Text>
          <NetworkStatus />
        </View>

        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#FFCC00" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
        {/* State: Searching */}
        {isSearching && bids.length === 0 && (
          <Animated.View entering={FadeInUp} style={styles.searchingContainer}>
            <View style={styles.radarContainer}>
              <RadarRipple delay={0} />
              <RadarRipple delay={1000} />
              <View style={styles.radarCore}>
                <Ionicons name="search" size={32} color="#1A1A1A" />
              </View>
            </View>
            <Text style={styles.searchingText}>Finding nearby drivers...</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsSearching(false)}
            >
              <Text style={styles.cancelText}>Cancel Request</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* State: Bids Received */}
        {bids.length > 0 && (
          <View style={styles.bidsContainer}>
            <Text style={styles.bidsTitle}>Offers For You ({bids.length})</Text>
            <ScrollView
              style={styles.bidsList}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {bids.map((bid, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInDown.delay(index * 100)}
                  style={styles.bidCard}
                >
                  <View style={styles.bidHeader}>
                    <View style={styles.driverInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {bid.driverName[0]}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.driverName}>{bid.driverName}</Text>
                        <View style={styles.ratingRow}>
                          <Ionicons name="star" size={12} color="#FFCC00" />
                          <Text style={styles.ratingText}>
                            4.9 • 2 mins away
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.bidPrice}>LRD {bid.amount}</Text>
                  </View>

                  <View style={styles.bidActions}>
                    <TouchableOpacity
                      style={styles.declineBtn}
                      onPress={() => {}}
                    >
                      <Ionicons name="close" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.acceptBtn}
                      onPress={() => handleAcceptBid(bid)}
                    >
                      <Text style={styles.acceptBtnText}>ACCEPT RIDE</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#1A1A1A"
                      />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* State: IDLE (Bottom Card) */}
        {!isSearching && bids.length === 0 && (
          <Animated.View entering={FadeInDown} style={styles.bottomCard}>
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

            <TouchableOpacity
              style={styles.audioButton}
              onPress={() => setHaggleVisible(true)}
            >
              <Ionicons name="pricetag" size={24} color="#1A1A1A" />
              <Text style={styles.audioButtonText}>Negotiate Ride</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      <HaggleSheet
        visible={haggleVisible}
        onClose={() => setHaggleVisible(false)}
        onRequest={handleSendRequest}
      />
    </View>
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
    zIndex: 10,
  },
  headerCenter: {
    alignItems: "center",
  },
  backButton: {
    padding: 8,
  },
  brandTitle: {
    fontSize: 24,
    fontFamily: "Outfit_900Black",
    color: "#FFCC00",
    letterSpacing: -1,
  },
  profileButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  // Bottom Card
  bottomCard: {
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
    fontFamily: "Outfit_700Bold",
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
    fontFamily: "Inter_600SemiBold",
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
    fontFamily: "Outfit_700Bold",
    fontSize: 18,
    marginLeft: 8,
  },
  // Searching State
  searchingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
  radarContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  radarCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFCC00",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  ripple: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 204, 0, 0.3)",
  },
  searchingText: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "Outfit_700Bold",
    marginBottom: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: "#333",
  },
  cancelText: {
    color: "#FF3B30",
    fontFamily: "Inter_600SemiBold",
  },
  // Bids State
  bidsContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  bidsTitle: {
    fontSize: 18,
    color: "#DDD",
    fontFamily: "Outfit_700Bold",
    marginBottom: 16,
  },
  bidsList: {
    flex: 1,
  },
  bidCard: {
    backgroundColor: "#252525",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  bidHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  driverInfo: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  avatarText: {
    color: "#FFF",
    fontFamily: "Outfit_700Bold",
    fontSize: 20,
  },
  driverName: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Outfit_700Bold",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    color: "#888",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  bidPrice: {
    color: "#FFCC00",
    fontSize: 24,
    fontFamily: "Outfit_900Black",
  },
  bidActions: {
    flexDirection: "row",
    gap: 12,
  },
  declineBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.3)",
  },
  acceptBtn: {
    flex: 1,
    height: 56,
    backgroundColor: "#FFCC00",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  acceptBtnText: {
    color: "#1A1A1A",
    fontFamily: "Outfit_900Black",
    fontSize: 16,
  },
});
