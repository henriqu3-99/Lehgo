import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { api } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const role = params.role || "rider";
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Mock image picker for now to avoid permission complexity in prototype
    // In real app: ImagePicker.launchImageLibraryAsync(...)
    setImage("https://i.pravatar.cc/300");
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
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000)}
          style={styles.header}
        >
          <Text style={styles.supTitle}>Last Step.</Text>
          <Text style={styles.title}>Who we picking up?</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(1000)}
          style={styles.formContainer}
        >
          {/* Profile Photo Mock */}
          <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={32} color="#FFCC00" />
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={12} color="#000" />
            </View>
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Your Name (e.g. Chief)"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              name.length > 2 ? styles.buttonActive : styles.buttonInactive,
            ]}
            activeOpacity={0.8}
            onPress={async () => {
              // Persist user to backend
              const user = await api.createUser(
                (params.phone as string) || "+231000000",
                name,
                role as string,
                0, // Default lat
                0 // Default long
              );

              if (user && user.id) {
                await AsyncStorage.setItem("userId", user.id.toString());
                await AsyncStorage.setItem("userRole", role as string);
              }

              // Navigate
              router.replace(role === "driver" ? "/driver" : "/(tabs)");
            }}
            disabled={name.length <= 2}
          >
            <LinearGradient
              colors={
                name.length > 2 ? ["#FFCC00", "#FFB300"] : ["#333", "#333"]
              }
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text
                style={[
                  styles.buttonText,
                  name.length > 2 ? { color: "#1A1A1A" } : { color: "#666" },
                ]}
              >
                Start Riding
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  supTitle: {
    fontSize: 18,
    color: "#888",
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 40,
    color: "#FFF",
    fontWeight: "900",
    letterSpacing: -1,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  photoContainer: {
    marginBottom: 40,
    position: "relative",
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2A2A2A",
    borderWidth: 2,
    borderColor: "#FFCC00",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FFCC00",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFCC00",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  inputWrapper: {
    width: "100%",
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    height: 64,
    marginBottom: 24,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  input: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "600",
  },
  button: {
    width: "100%",
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
    fontWeight: "bold",
  },
});
