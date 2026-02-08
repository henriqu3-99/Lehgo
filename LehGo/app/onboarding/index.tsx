import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/services/api";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useState } from "react";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const role = params.role || "rider"; // Fallback to rider if missing
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#1A1A1A", "#000000"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Dynamic Background Elements */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Animated.View
          entering={FadeInUp.delay(200).duration(1000)}
          style={styles.header}
        >
          <Text style={styles.supTitle}>We Ready?</Text>
          <Text style={styles.title}>Let's Move.</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(1000)}
          style={styles.formContainer}
        >
          <View style={styles.inputWrapper}>
            <Text style={styles.countryCode}>🇱🇷 +231</Text>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              placeholder="77 000 0000"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                // Strip leading zero if present
                if (text.startsWith("0")) {
                  setPhoneNumber(text.substring(1));
                } else {
                  setPhoneNumber(text);
                }
              }}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              phoneNumber.length >= 8 // 77 xxxxxxx is 9 digits usually, but lets match 8 min
                ? styles.buttonActive
                : styles.buttonInactive,
            ]}
            activeOpacity={0.8}
            onPress={async () => {
              const fullPhone = "+231" + phoneNumber;

              // Send OTP via Backend
              const res = await api.sendOTP(fullPhone);

              if (res && res.status === "sent") {
                if (res.dev_code) {
                  alert(`DEV MODE CODE: ${res.dev_code}`); // Helpful for testing
                }

                router.push({
                  pathname: "/onboarding/otp",
                  params: { phone: fullPhone, role },
                });
              } else {
                alert("Failed to send SMS. Try again.");
              }
            }}
            disabled={phoneNumber.length < 8}
          >
            <LinearGradient
              colors={
                phoneNumber.length >= 8
                  ? ["#FFCC00", "#FFB300"]
                  : ["#333", "#333"]
              }
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text
                style={[
                  styles.buttonText,
                  phoneNumber.length >= 8
                    ? { color: "#1A1A1A" }
                    : { color: "#666" },
                ]}
              >
                LehGo
              </Text>
              <Ionicons
                name="arrow-forward"
                size={24}
                color={phoneNumber.length >= 8 ? "#1A1A1A" : "#666"}
                style={{ marginLeft: 8 }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600).duration(1000)}
          style={styles.footer}
        >
          <Text style={styles.footerText}>Secure & Local. 🔒</Text>
        </Animated.View>
      </KeyboardAvoidingView>
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
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  // Background Ambient
  circle1: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 204, 0, 0.05)", // Yellow faint
  },
  circle2: {
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(0, 200, 83, 0.05)", // Green faint
  },
  header: {
    marginBottom: 60,
  },
  supTitle: {
    fontSize: 24,
    color: "#FFCC00",
    fontFamily: "Outfit_700Bold",
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 56,
    color: "#FFF",
    fontFamily: "Outfit_900Black",
    lineHeight: 60,
    letterSpacing: -2,
  },
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    height: 64,
    marginBottom: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  countryCode: {
    fontSize: 20,
    color: "#FFF",
    fontFamily: "Outfit_500Medium",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#444",
    marginHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 24,
    color: "#FFF",
    fontFamily: "Outfit_700Bold",
    letterSpacing: 1,
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
    height: 64,
  },
  buttonActive: {
    shadowColor: "#FFCC00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonInactive: {},
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Outfit_700Bold",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  footerText: {
    color: "#444",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
