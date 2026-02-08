import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>Chief Rider</Text>
          <Text style={styles.phone}>+231 77 555 000</Text>
        </View>

        <View style={styles.menu}>
          <MenuItem icon="wallet" label="Wallet" value="LRD 500" />
          <MenuItem icon="settings" label="Settings" />
          <MenuItem icon="help-circle" label="Support" />
          <MenuItem icon="log-out" label="Log Out" data-danger />
        </View>
      </SafeAreaView>
    </View>
  );
}

function MenuItem({ icon, label, value, ...props }: any) {
  const isDanger = props["data-danger"];
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={[styles.iconBox, isDanger && styles.iconBoxDanger]}>
        <Ionicons
          name={icon as any}
          size={20}
          color={isDanger ? "#FF3B30" : "#FFF"}
        />
      </View>
      <Text style={[styles.menuLabel, isDanger && styles.textDanger]}>
        {label}
      </Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
      {!value && <Ionicons name="chevron-forward" size={20} color="#444" />}
    </TouchableOpacity>
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
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#FFCC00",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    color: "#FFF",
    fontFamily: "Outfit_700Bold",
  },
  phone: {
    fontSize: 16,
    color: "#888",
    marginTop: 4,
    fontFamily: "Inter_400Regular",
  },
  menu: {
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  iconBoxDanger: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  menuLabel: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  textDanger: {
    color: "#FF3B30",
  },
  menuValue: {
    color: "#FFCC00",
    fontFamily: "Outfit_700Bold",
    marginRight: 8,
  },
});
