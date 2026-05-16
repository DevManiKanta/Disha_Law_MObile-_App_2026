import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  // Demo stats (replace with real storage/API later)
  const stats = useMemo(() => {
    const totalClients = 24;
    const totalCalls = 57;
    const appointmentsToday = 3;
    const followupsToday = 5;
    return { totalClients, totalCalls, appointmentsToday, followupsToday };
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top + 10, 12), paddingBottom: Math.max(insets.bottom + 18, 18) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Quick overview of your day</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="sparkles-outline" size={16} color="#0f172a" />
          <Text style={styles.headerBadgeText}>Today</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={[styles.kpiCard, { backgroundColor: "#0f172a" }]}>
          <View style={styles.kpiTop}>
            <Ionicons name="call-outline" size={18} color="#fff" />
            <Text style={[styles.kpiLabel, { color: "rgba(255,255,255,0.75)" }]}>Total Calls</Text>
          </View>
          <Text style={[styles.kpiValue, { color: "#fff" }]}>{stats.totalCalls}</Text>
        </View>

        <View style={styles.kpiCard}>
          <View style={styles.kpiTop}>
            <Ionicons name="people-outline" size={18} color="#0f172a" />
            <Text style={styles.kpiLabel}>Clients</Text>
          </View>
          <Text style={styles.kpiValue}>{stats.totalClients}</Text>
        </View>

        <View style={styles.kpiCard}>
          <View style={styles.kpiTop}>
            <Ionicons name="calendar-outline" size={18} color="#0f172a" />
            <Text style={styles.kpiLabel}>Appointments</Text>
          </View>
          <Text style={styles.kpiValue}>{stats.appointmentsToday}</Text>
          <Text style={styles.kpiHint}>Today</Text>
        </View>

        <View style={styles.kpiCard}>
          <View style={styles.kpiTop}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#0f172a" />
            <Text style={styles.kpiLabel}>Follow-ups</Text>
          </View>
          <Text style={styles.kpiValue}>{stats.followupsToday}</Text>
          <Text style={styles.kpiHint}>Today</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <Text style={styles.sectionSub}>Add records faster</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.actionCard}
          onPress={() => {
            router.push("/(drawer)/(tabs)/add-client");
          }}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="person-add-outline" size={18} color="#0f172a" />
          </View>
          <Text style={styles.actionTitle}>Add Client</Text>
          <Text style={styles.actionSub}>Create a new client</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.actionCard}
          onPress={() => {
            router.push("/(drawer)/(tabs)/appointments");
          }}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="calendar-clear-outline" size={18} color="#0f172a" />
          </View>
          <Text style={styles.actionTitle}>Add Appointment</Text>
          <Text style={styles.actionSub}>Book a meeting</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent</Text>
        <Text style={styles.sectionSub}>Latest activity</Text>
      </View>

      <View style={styles.recentCard}>
        <View style={styles.recentRow}>
          <View style={styles.recentDot} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.recentTitle} numberOfLines={1}>
              John Doe • Appointment booked
            </Text>
            <Text style={styles.recentSub}>10:30 AM • Online</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  content: {
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.3,
  },

  subtitle: {
    marginTop: 4,
    color: "#64748b",
    fontWeight: "600",
  },

  headerBadge: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  headerBadgeText: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 13,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },

  kpiCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eef2f7",
    borderRadius: 18,
    padding: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },

  kpiTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  kpiLabel: {
    color: "#64748b",
    fontWeight: "800",
    fontSize: 12,
  },

  kpiValue: {
    marginTop: 10,
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 28,
    letterSpacing: -0.2,
  },

  kpiHint: {
    marginTop: 4,
    color: "#94a3b8",
    fontWeight: "800",
    fontSize: 12,
  },

  sectionHeader: {
    marginTop: 10,
    marginBottom: 10,
  },

  sectionTitle: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 14,
  },

  sectionSub: {
    marginTop: 4,
    color: "#64748b",
    fontWeight: "600",
    fontSize: 12.5,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },

  actionCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eef2f7",
    borderRadius: 18,
    padding: 12,
  },

  actionIcon: {
    height: 36,
    width: 36,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  actionTitle: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 13.5,
  },

  actionSub: {
    marginTop: 3,
    color: "#64748b",
    fontWeight: "600",
    fontSize: 12,
  },

  recentCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eef2f7",
    borderRadius: 18,
    padding: 12,
  },

  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  recentDot: {
    height: 10,
    width: 10,
    borderRadius: 999,
    backgroundColor: "#22c55e",
  },

  recentTitle: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 13,
  },

  recentSub: {
    marginTop: 2,
    color: "#64748b",
    fontWeight: "600",
    fontSize: 12,
  },
});
