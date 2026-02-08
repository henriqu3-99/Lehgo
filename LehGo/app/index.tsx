import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function GatewayScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background */}
      <LinearGradient
        colors={["#1A1A1A", "#000000"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {/* Brand */}
        <View style={styles.brandSection}>
          <Text style={styles.brandTitle}>LehGo</Text>
          <Text style={styles.tagline}>Your Ride. Your Way.</Text>
        </View>

        {/* Role Selection */}
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/onboarding",
                params: { role: "rider" },
              })
            }
          >
            <LinearGradient
              colors={["#FFCC00", "#FFB300"]}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="person" size={32} color="#1A1A1A" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Rider</Text>
                <Text style={styles.cardSubtitle}>Get me there fast.</Text>
              </View>
              <Ionicons
                name="arrow-forward-circle"
                size={40}
                color="#1A1A1A"
                style={styles.arrow}
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/onboarding",
                params: { role: "driver" },
              })
            }
          >
            <LinearGradient
              colors={["#2A2A2A", "#1F1F1F"]}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[styles.cardIcon, { backgroundColor: "#333" }]}>
                <Ionicons name="car-sport" size={32} color="#00C853" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, { color: "#FFF" }]}>
                  Driver
                </Text>
                <Text style={[styles.cardSubtitle, { color: "#888" }]}>
                  Earn on your schedule.
                </Text>
              </View>
              <Ionicons
                name="arrow-forward-circle"
                size={40}
                color="#00C853"
                style={styles.arrow}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  brandSection: {
    marginBottom: 60,
    alignItems: "center",
  },
  brandTitle: {
    fontFamily: "Outfit_900Black",
    fontSize: 56,
    color: "#FFCC00",
    letterSpacing: -2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: "#888",
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
  },
  selectionContainer: {
    gap: 20,
  },
  card: {
    height: 120,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontFamily: "Outfit_700Bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(26,26,26,0.7)",
    fontFamily: "Inter_600SemiBold",
  },
  arrow: {
    opacity: 0.8,
  },
});
