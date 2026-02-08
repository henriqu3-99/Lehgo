import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { mqttService } from "@/services/mqtt";
import { Colors } from "@/constants/Colors";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";

export function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect and listen
    mqttService.connect();
    const unsubscribe = mqttService.addStatusListener(setIsConnected);
    return () => unsubscribe();
  }, []);

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(
        withSequence(
          withTiming(0.4, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      ),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: isConnected
              ? Colors.state.success
              : Colors.state.error,
          },
          isConnected ? animatedDotStyle : null,
        ]}
      />
      <Text
        style={[
          styles.text,
          { color: isConnected ? Colors.state.success : Colors.state.error },
        ]}
      >
        {isConnected ? "LIVE" : "OFFLINE"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
});
