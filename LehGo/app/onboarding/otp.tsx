import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useState, useRef, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { api } from "@/services/api";

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phoneNumber = params.phone as string;

  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDigitChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next
    if (text.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if full
    if (index === 3 && text.length === 1) {
      const fullCode = newCode.join("");
      verifyCode(fullCode);
    }
  };

  const handleBackspace = (text: string, index: number) => {
    // Logic for backspace handled roughly by onChangeText if empty,
    // but strictly onKeyPress is better. For prototype simplicity:
    if (text === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (fullCode: string) => {
    // Call Backend Verification
    const isValid = await api.verifyOTP(phoneNumber, fullCode);

    if (isValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({
        pathname: "/onboarding/profile",
        params: { role: params.role, phone: phoneNumber },
      });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert("Invalid Code. Please try again.");
      setCode(["", "", "", ""]); // Reset
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#1A1A1A", "#000000"]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Animated.View
          entering={FadeInUp.delay(200).duration(1000)}
          style={styles.header}
        >
          <Text style={styles.supTitle}>Verification Password</Text>
          <Text style={styles.title}>Check your SMS.</Text>
          <Text style={styles.subText}>
            We sent a code to{" "}
            <Text style={{ color: "#FFCC00" }}>
              {phoneNumber || "+231 77 000 0000"}
            </Text>
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(1000)}
          style={styles.inputContainer}
        >
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[styles.otpBox, digit.length > 0 && styles.otpBoxFilled]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => {
                if (text.length === 0) {
                  const newCode = [...code];
                  newCode[index] = "";
                  setCode(newCode);
                  if (index > 0) inputRefs.current[index - 1]?.focus();
                } else {
                  handleDigitChange(text, index);
                }
              }}
              // Simple cursor color
              selectionColor="#FFCC00"
            />
          ))}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600).duration(1000)}
          style={styles.resendContainer}
        >
          <Text style={styles.resendText}>
            {timer > 0 ? `Resend code in ${timer}s` : "I didn't get a code"}
          </Text>
          {timer === 0 && (
            <TouchableOpacity
              onPress={() => {
                setTimer(30);
                alert("Resent!");
              }}
            >
              <Text style={styles.resendLink}>Resend SMS</Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
    zIndex: 10,
    padding: 8,
  },
  header: {
    marginBottom: 40,
  },
  supTitle: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Outfit_500Medium",
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 48,
    color: "#FFF",
    fontFamily: "Outfit_900Black",
    lineHeight: 52,
    letterSpacing: -2,
    marginBottom: 16,
  },
  subText: {
    color: "#CCC",
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    lineHeight: 26,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  otpBox: {
    width: 72,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#333",
    color: "#FFF",
    fontSize: 32,
    fontFamily: "Outfit_700Bold",
    textAlign: "center",
  },
  otpBoxFilled: {
    borderColor: "#FFCC00",
    backgroundColor: "rgba(255, 204, 0, 0.1)",
  },
  resendContainer: {
    alignItems: "center",
  },
  resendText: {
    color: "#666",
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  resendLink: {
    color: "#FFCC00",
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
  },
});
