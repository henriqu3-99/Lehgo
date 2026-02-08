import { StyleSheet, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.content}>
        <Text style={styles.title}>Your Activity</Text>

        <ScrollView contentContainerStyle={styles.list}>
          {/* Mock Items */}
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons name="checkmark-circle" size={24} color="#00C853" />
              </View>
              <View style={styles.info}>
                <Text style={styles.dest}>Market {"->"} Junction</Text>
                <Text style={styles.date}>Today, 10:3{i} AM</Text>
              </View>
              <Text style={styles.price}>LRD 150</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: "Outfit_900Black",
    color: "#FFF",
    marginBottom: 24,
  },
  list: {
    gap: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  iconBox: {
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  dest: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Outfit_700Bold",
  },
  date: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Inter_400Regular",
  },
  price: {
    color: "#FFCC00",
    fontSize: 16,
    fontFamily: "Outfit_700Bold",
  },
});
