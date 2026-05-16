import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CalendarList } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const DATA = [
  {
    id: "a1",
    title: "Consultation",
    client: "John Doe",
    type: "Online",
    time: "10:30 AM",
    date: "Today",
  },
  {
    id: "a2",
    title: "Consultation",
    client: "Sarah Smith",
    type: "Offline",
    time: "4:15 PM",
    date: "Tomorrow",
  },

  {
    id: "a3",
    title: "Consultation",
    client: "Michael Smith",
    type: "Offline",
    time: "4:15 PM",
    date: "Tomorrow",
  },
];

export default function DrawerAppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDateFilter, setSelectedDateFilter] = useState("All");
  const [customDate, setCustomDate] = useState(""); // YYYY-MM-DD
  const [customDay, setCustomDay] = useState(null); // Date | null
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [draftDate, setDraftDate] = useState(null); // "YYYY-MM-DD" | null

  const DATE_FILTERS = ["All", "Today", "Tomorrow", "This Week", "Custom"];

  const parseYmd = useCallback((value) => {
    const v = String(value || "").trim();
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    const dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
    return dt;
  }, []);

  const getItemDate = useCallback((item) => {
    if (item?.createdAt) {
      const d = new Date(item.createdAt);
      return isNaN(d.getTime()) ? null : d;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (item?.date === "Today") return today;
    if (item?.date === "Tomorrow") return new Date(today.getTime() + 24 * 60 * 60 * 1000);
    if (item?.date === "This Week") return new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
    return null;
  }, []);

  const filteredData = useMemo(() => {
    return DATA.filter((item) => {
      if (selectedDateFilter === "All") return true;
      if (selectedDateFilter === "Custom") {
        if (!customDay) return true;
        const itemDate = getItemDate(item);
        if (!itemDate) return false;
        const itemMidnight = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        return itemMidnight.getTime() === customDay.getTime();
      }
      return item.date === selectedDateFilter;
    });
  }, [customDay, getItemDate, selectedDateFilter]);

  const dateCounts = useMemo(() => {
    const counts = Object.fromEntries(DATE_FILTERS.map((d) => [d, 0]));
    for (const item of DATA) {
      counts.All += 1;
      if (counts[item.date] !== undefined) counts[item.date] += 1;
    }
    if (counts.Custom !== undefined) {
      if (!customDay) counts.Custom = 0;
      else {
        let c = 0;
        for (const item of DATA) {
          const itemDate = getItemDate(item);
          if (!itemDate) continue;
          const itemMidnight = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
          if (itemMidnight.getTime() === customDay.getTime()) c += 1;
        }
        counts.Custom = c;
      }
    }
    return counts;
  }, [DATE_FILTERS, customDay, getItemDate]);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top + 6, 10) }]}>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 70 }}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Appointments</Text>
              <Text style={styles.subtitle}>
                {filteredData.length} appointment{filteredData.length === 1 ? "" : "s"} • Your upcoming schedule
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              {DATE_FILTERS.map((item) => {
                const isActive = selectedDateFilter === item;
                const label = item === "Custom" && customDay ? customDate : item;
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.filterButton, isActive && styles.activeFilter]}
                    activeOpacity={0.85}
                    onPress={() => {
                      if (item === "Custom") {
                        setSelectedDateFilter("Custom");
                        setDraftDate(customDate || null);
                        setIsCalendarOpen(true);
                        return;
                      }
                      setSelectedDateFilter(item);
                      setCustomDate("");
                      setCustomDay(null);
                    }}
                  >
                    <Text style={[styles.filterText, isActive && styles.activeFilterText]}>{label}</Text>
                    <View style={[styles.filterCount, isActive && styles.filterCountActive]}>
                      <Text style={[styles.filterCountText, isActive && styles.filterCountTextActive]}>
                        {dateCounts[item] ?? 0}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {selectedDateFilter === "Custom" && customDay && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.clearChip}
                  onPress={() => {
                    setCustomDate("");
                    setCustomDay(null);
                  }}
                >
                  <Ionicons name="close" size={16} color="#334155" />
                </TouchableOpacity>
              )}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.card}
            onPress={() => {
              router.push({
                pathname: `/(drawer)/appointments/${item.id}`,
                params: {
                  title: item.title,
                  client: item.client,
                  type: item.type,
                  time: item.time,
                  date: item.date,
                },
              });
            }}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardLeft}>
                <View style={styles.iconCircle}>
                  <Ionicons name="calendar-outline" size={18} color="#0f172a" />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardSub} numberOfLines={1}>
                    {item.client} • {item.type}
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Ionicons name="time-outline" size={14} color="#64748b" />
                <Text style={styles.metaText}>{item.time}</Text>
              </View>
              <View style={styles.metaChipGhost}>
                <Ionicons name="calendar-clear-outline" size={14} color="#94a3b8" />
                <Text style={styles.metaTextGhost}>{item.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={44} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No appointments</Text>
            <Text style={styles.emptySub}>Create one from the bottom sheet in tabs.</Text>
          </View>
        }
      />

      <Modal
        visible={isCalendarOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsCalendarOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsCalendarOpen(false)} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Select date</Text>
              <Text style={styles.modalSubtitle}>Tap any date to select</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.modalClose}
              onPress={() => setIsCalendarOpen(false)}
            >
              <Ionicons name="close" size={18} color="#0f172a" />
            </TouchableOpacity>
          </View>

          <CalendarList
            markedDates={
              draftDate
                ? {
                    [draftDate]: {
                      selected: true,
                      selectedColor: "#0f172a",
                      selectedTextColor: "#fff",
                    },
                  }
                : {}
            }
            pastScrollRange={12}
            futureScrollRange={12}
            scrollEnabled
            showScrollIndicator={false}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#64748b",
              selectedDayBackgroundColor: "#0f172a",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#0f172a",
              dayTextColor: "#0f172a",
              textDisabledColor: "#cbd5e1",
              arrowColor: "#0f172a",
              monthTextColor: "#0f172a",
              textMonthFontWeight: "800",
              textDayFontWeight: "600",
            }}
            onDayPress={(day) => {
              const picked = day?.dateString;
              if (!picked) return;
              setDraftDate(picked);
            }}
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.modalGhost}
              onPress={() => setDraftDate(null)}
            >
              <Text style={styles.modalGhostText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.modalPrimary}
              onPress={() => {
                if (!draftDate) return;
                const dt = parseYmd(draftDate);
                if (!dt) return;
                const midnight = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
                setCustomDate(draftDate);
                setCustomDay(midnight);
                setIsCalendarOpen(false);
              }}
            >
              <Text style={styles.modalPrimaryText}>Use date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 18,
  },

  header: {
    marginBottom: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.3,
  },

  subtitle: {
    marginTop: 4,
    color: "#64748b",
    fontWeight: "600",
    fontSize: 13,
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 8,
    marginBottom: 6,
  },

  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  activeFilter: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },

  filterText: {
    color: "#0f172a",
    fontWeight: "800",
    fontSize: 12.5,
  },

  activeFilterText: {
    color: "#fff",
  },

  filterCount: {
    minWidth: 22,
    paddingHorizontal: 7,
    height: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e2e8f0",
  },

  filterCountActive: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  filterCountText: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 11.5,
  },

  filterCountTextActive: {
    color: "#fff",
  },

  clearChip: {
    height: 34,
    width: 34,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },

  modalSheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingBottom: 16,
  },

  modalHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  modalTitle: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 16,
  },

  modalSubtitle: {
    color: "#64748b",
    fontWeight: "600",
    marginTop: 2,
  },

  modalClose: {
    height: 36,
    width: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  modalFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: "row",
    gap: 10,
  },

  modalGhost: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },

  modalGhostText: {
    color: "#334155",
    fontWeight: "900",
  },

  modalPrimary: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },

  modalPrimaryText: {
    color: "#ffffff",
    fontWeight: "900",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 11,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eef2f7",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
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

  cardTitle: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 15.5,
  },

  cardSub: {
    marginTop: 1,
    color: "#64748b",
    fontWeight: "700",
    fontSize: 12,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
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

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
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
    maxWidth: 280,
  },
});

