import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppointmentFollowupScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const params = useLocalSearchParams();

  const appointment = useMemo(() => {
    return {
      id: params?.id,
      title: typeof params?.title === "string" ? params.title : "Appointment",
      client: typeof params?.client === "string" ? params.client : "",
      type: typeof params?.type === "string" ? params.type : "",
      time: typeof params?.time === "string" ? params.time : "",
      date: typeof params?.date === "string" ? params.date : "",
    };
  }, [params]);

  const [callStatus, setCallStatus] = useState("Answered"); // Answered | Not Answered | Busy
  const [outcome, setOutcome] = useState("Coming"); // Coming | Not Coming | Cancelled | Reschedule
  const [remarks, setRemarks] = useState("");
  const [history, setHistory] = useState([]); // newest first

  useEffect(() => {
    nav.setOptions?.({ title: "Follow-up" });
  }, [nav]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top + 10, 12), paddingBottom: Math.max(insets.bottom + 18, 18) },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.iconCircle}>
            <Ionicons name="call-outline" size={18} color="#0f172a" />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.title} numberOfLines={1}>
              {appointment.title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {appointment.client}
              {appointment.type ? ` • ${appointment.type}` : ""}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          {!!appointment.time && (
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={14} color="#64748b" />
              <Text style={styles.metaText}>{appointment.time}</Text>
            </View>
          )}
          {!!appointment.date && (
            <View style={styles.metaChipGhost}>
              <Ionicons name="calendar-clear-outline" size={14} color="#94a3b8" />
              <Text style={styles.metaTextGhost}>{appointment.date}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.label}>Call Status</Text>
      <View style={styles.row}>
        {["Answered", "Not Answered", "Busy"].map((v) => {
          const active = callStatus === v;
          return (
            <TouchableOpacity
              key={v}
              activeOpacity={0.85}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => setCallStatus(v)}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{v}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Outcome</Text>
      <View style={styles.row}>
        {["Coming", "Not Coming", "Cancelled", "Reschedule"].map((v) => {
          const active = outcome === v;
          return (
            <TouchableOpacity
              key={v}
              activeOpacity={0.85}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => setOutcome(v)}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{v}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Remarks</Text>
      <TextInput
        value={remarks}
        onChangeText={setRemarks}
        placeholder="Write follow-up notes…"
        placeholderTextColor="#94a3b8"
        multiline
        style={styles.textArea}
      />

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.saveBtn}
        onPress={() => {
          const now = new Date();
          const timeLabel = now.toLocaleString();
          setHistory((prev) => [
            {
              id: String(now.getTime()),
              createdAtLabel: timeLabel,
              callStatus,
              outcome,
              remarks: remarks.trim(),
            },
            ...prev,
          ]);
          setRemarks("");
        }}
      >
        <Ionicons name="checkmark-done" size={18} color="#fff" />
        <Text style={styles.saveText}>Save Follow-up</Text>
      </TouchableOpacity>

      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Follow-up History</Text>
        <Text style={styles.historyCount}>{history.length}</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.historyEmpty}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#94a3b8" />
          <Text style={styles.historyEmptyText}>No follow-ups yet</Text>
        </View>
      ) : (
        history.map((h) => (
          <View key={h.id} style={styles.historyCard}>
            <View style={styles.historyTop}>
              <Text style={styles.historyDate}>{h.createdAtLabel}</Text>
              <View style={styles.historyBadges}>
                <View style={styles.historyBadge}>
                  <Text style={styles.historyBadgeText}>{h.callStatus}</Text>
                </View>
                <View style={styles.historyBadgeGhost}>
                  <Text style={styles.historyBadgeGhostText}>{h.outcome}</Text>
                </View>
              </View>
            </View>

            {!!h.remarks && <Text style={styles.historyRemarks}>{h.remarks}</Text>}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 18,
  },

  content: {
    paddingBottom: 18,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eef2f7",
    marginBottom: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconCircle: {
    height: 36,
    width: 36,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 16,
  },

  subtitle: {
    marginTop: 2,
    color: "#64748b",
    fontWeight: "700",
    fontSize: 12,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },

  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  metaText: {
    color: "#334155",
    fontWeight: "800",
    fontSize: 11.5,
  },

  metaChipGhost: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },

  metaTextGhost: {
    color: "#94a3b8",
    fontWeight: "800",
    fontSize: 11.5,
  },

  label: {
    marginTop: 10,
    marginBottom: 8,
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 13,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  pill: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  pillActive: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },

  pillText: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 12.5,
  },

  pillTextActive: {
    color: "#ffffff",
  },

  textArea: {
    minHeight: 120,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#0f172a",
    fontWeight: "700",
    textAlignVertical: "top",
  },

  saveBtn: {
    marginTop: 14,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },

  saveText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 15,
  },

  historyHeader: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  historyTitle: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 14,
  },

  historyCount: {
    color: "#64748b",
    fontWeight: "900",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 999,
    textAlignVertical: "center",
    includeFontPadding: false,
  },

  historyEmpty: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eef2f7",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  historyEmptyText: {
    color: "#64748b",
    fontWeight: "800",
  },

  historyCard: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eef2f7",
    borderRadius: 18,
    padding: 12,
  },

  historyTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  historyDate: {
    color: "#94a3b8",
    fontWeight: "800",
    fontSize: 11.5,
    flex: 1,
  },

  historyBadges: {
    flexDirection: "row",
    gap: 6,
  },

  historyBadge: {
    backgroundColor: "#0f172a",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  historyBadgeText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 11.5,
  },

  historyBadgeGhost: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  historyBadgeGhostText: {
    color: "#334155",
    fontWeight: "900",
    fontSize: 11.5,
  },

  historyRemarks: {
    marginTop: 10,
    color: "#0f172a",
    fontWeight: "700",
    lineHeight: 18,
  },
});

