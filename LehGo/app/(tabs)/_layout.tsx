import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFCC00",
        tabBarInactiveTintColor: "#666",
        tabBarBackground: () => (
          <View style={styles.blurContainer}>
            {/* Fallback for Android or if BlurView mimics glass differently */}
            <View style={styles.glassBackground} />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons name="map" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons name="time" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <Ionicons name="person" size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: "transparent",
    borderRadius: 25,
    height: 70,
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "rgba(20,20,20,0.9)", // Dark glass fallback
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20,20,20,0.95)",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  activeIcon: {
    backgroundColor: "rgba(255, 204, 0, 0.1)", // Subtle yellow glow
  },
});
