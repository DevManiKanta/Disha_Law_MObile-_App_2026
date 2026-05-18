import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList } from "react-native";
import AddAppointmentSheet from "../../components/AddAppointmentSheet";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function Appointments() {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef(null);
  const params = useLocalSearchParams();
  const [prefill, setPrefill] = useState(null);
  const [appointments, setAppointments] = useState([]);

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
    requestAnimationFrame(() => openSheet());
  }, [params?.openSheet, params?.name, params?.phone]);

  const handleSaveAppointment = (appointmentData) => {
    const newAppointment = {
      id: Date.now().toString(),
      ...appointmentData,
      createdAt: new Date().toLocaleString(),
    };
    setAppointments([newAppointment, ...appointments]);
  };

  const getStatusColor = (status) => {
    if (status === "Confirmed") return { bg: "#ecfdf5", text: "#10b981", icon: "#059669" };
    if (status === "Pending") return { bg: "#fef3c7", text: "#f59e0b", icon: "#d97706" };
    return { bg: "#fee2e2", text: "#ef4444", icon: "#dc2626" };
  };

  const getTypeColor = (type) => {
    return type === "Online" ? "#3b82f6" : "#8b5cf6";
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top + 10, 12), paddingBottom: Math.max(insets.bottom + 18, 18) }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.subtitle}>Schedule and manage meetings</Text>
      </View>

      {appointments.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={44} color="#94a3b8" />
          <Text style={styles.emptyTitle}>No appointments yet</Text>
          <Text style={styles.emptySub}>Tap below to add your first appointment.</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const statusColor = getStatusColor(item.status || "Pending");
            const typeColor = getTypeColor(item.type);
            return (
              <Animated.View
                style={styles.appointmentCard}
                entering={FadeInUp.duration(600).delay(index * 100)}
              >
                <LinearGradient
                  colors={["#fff", "#f8fafc"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardLeft}>
                      <View style={[styles.typeIcon, { backgroundColor: typeColor + "20" }]}>
                        <Ionicons
                          name={item.type === "Online" ? "videocam-outline" : "location-outline"}
                          size={20}
                          color={typeColor}
                        />
                      </View>
                      <View style={styles.cardInfo}>
                        <Text style={styles.clientName}>{item.clientName}</Text>
                        <Text style={styles.appointmentType}>{item.type} Appointment</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                      <Text style={[styles.statusText, { color: statusColor.text }]}>
                        {item.status || "Pending"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  <View style={styles.cardDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={16} color="#64748b" />
                      <Text style={styles.detailText}>{item.date || "Not set"}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color="#64748b" />
                      <Text style={styles.detailText}>{item.time || "Not set"}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="call-outline" size={16} color="#64748b" />
                      <Text style={styles.detailText}>{item.clientPhone}</Text>
                    </View>
                    {item.fee && (
                      <View style={styles.detailRow}>
                        <Ionicons name="cash-outline" size={16} color="#64748b" />
                        <Text style={styles.detailText}>₹{item.fee}</Text>
                      </View>
                    )}
                  </View>

                  {item.notes && (
                    <>
                      <View style={styles.cardDivider} />
                      <View style={styles.notesSection}>
                        <Text style={styles.notesLabel}>Notes</Text>
                        <Text style={styles.notesText}>{item.notes}</Text>
                      </View>
                    </>
                  )}
                </LinearGradient>
              </Animated.View>
            );
          }}
        />
      )}

      <TouchableOpacity activeOpacity={0.9} style={styles.fab} onPress={openSheet}>
        <Ionicons name="add" size={26} color="#fff" />
        <Text style={styles.fabText}>Add Appointment</Text>
      </TouchableOpacity>

      <AddAppointmentSheet ref={sheetRef} prefill={prefill} onSave={handleSaveAppointment} />
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

  listContent: {
    paddingBottom: 100,
  },

  appointmentCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  cardGradient: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  cardInfo: {
    flex: 1,
  },

  clientName: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 2,
  },

  appointmentType: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },

  cardDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },

  cardDetails: {
    gap: 8,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  detailText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
  },

  notesSection: {
    marginTop: 8,
  },

  notesLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  notesText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
    lineHeight: 18,
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
