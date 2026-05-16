import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AddAppointmentSheet from "../../components/AddAppointmentSheet";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Appointments() {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef(null);
  const params = useLocalSearchParams();
  const [prefill, setPrefill] = useState(null);

  const openSheet = () => {
    sheetRef.current?.expand();
  };

  useEffect(() => {
    if (params?.openSheet !== "1") return;
    setPrefill({
      mode: "New",
      name: typeof params?.name === "string" ? params.name : "",
      phone: typeof params?.phone === "string" ? params.phone : "",
    });
    // open after state set
    requestAnimationFrame(() => openSheet());
  }, [params?.openSheet, params?.name, params?.phone]);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top + 10, 12), paddingBottom: Math.max(insets.bottom + 18, 18) }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.subtitle}>Schedule and manage meetings</Text>
      </View>

      <View style={styles.empty}>
        <Ionicons name="calendar-outline" size={44} color="#94a3b8" />
        <Text style={styles.emptyTitle}>No appointments yet</Text>
        <Text style={styles.emptySub}>Tap below to add your first appointment.</Text>
      </View>

      <TouchableOpacity activeOpacity={0.9} style={styles.fab} onPress={openSheet}>
        <Ionicons name="add" size={26} color="#fff" />
        <Text style={styles.fabText}>Add Appointment</Text>
      </TouchableOpacity>

      <AddAppointmentSheet ref={sheetRef} prefill={prefill} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
  },

  header: {
    marginBottom: 14,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.3,
  },

  subtitle: {
    marginTop: 6,
    color: "#64748b",
    fontWeight: "600",
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 90,
  },

  emptyTitle: {
    marginTop: 12,
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 16,
  },

  emptySub: {
    marginTop: 6,
    color: "#64748b",
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 260,
  },

  fab: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 18,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#0f172a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },

  fabText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },
});
