import {
    Animated,
    FlatList,
    LayoutAnimation,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";
  
  import { Ionicons } from "@expo/vector-icons";
  
  import { useCallback, useEffect, useMemo, useRef, useState } from "react";
  import { useSafeAreaInsets } from "react-native-safe-area-context";
  import { CalendarList } from "react-native-calendars";
  import { router } from "expo-router";
  
  const DATA = [
    {
      id: "1",
      name: "John Doe",
      phone: "9876543210",
      location: "New York",
      lead: "Hot",
      type: "Incoming",
      date: "Today",
    },
  
    {
      id: "2",
      name: "Sarah Smith",
      phone: "9999999999",
      location: "Chicago",
      lead: "Warm",
      type: "Outgoing",
      date: "Yesterday",
    },
  
    {
      id: "3",
      name: "Michael",
      phone: "8888888888",
      location: "Texas",
      lead: "Cold",
      type: "Incoming",
      date: "This Week",
    },
  ];
  
  export default function ClientsScreen() {
    const insets = useSafeAreaInsets();
    const [selectedDateFilter, setSelectedDateFilter] = useState("Today");
    const [selectedLeadFilter, setSelectedLeadFilter] = useState("All");
    const [customDate, setCustomDate] = useState(""); // YYYY-MM-DD
    const [customDay, setCustomDay] = useState(null); // Date | null
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [draftDate, setDraftDate] = useState(null); // "YYYY-MM-DD" | null
  
    const DATE_FILTERS = ["Today", "Yesterday", "This Week", "Custom"];
    const LEAD_FILTERS = ["All", "Cold", "Warm", "Hot"];

    const parseYmd = useCallback((value) => {
      // Accepts YYYY-MM-DD; returns Date at local midnight or null
      const v = String(value || "").trim();
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
      if (!m) return null;
      const y = Number(m[1]);
      const mo = Number(m[2]);
      const d = Number(m[3]);
      if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
      const dt = new Date(y, mo - 1, d);
      // basic validity (e.g. 2026-02-31)
      if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
      return dt;
    }, []);

    // kept for future use if you store real Date objects in UI
    // const toYmd = useCallback((date) => { ... }, []);

    const getItemDate = useCallback((item) => {
      // Prefer real timestamps if you add them later.
      if (item?.createdAt) {
        const d = new Date(item.createdAt);
        return isNaN(d.getTime()) ? null : d;
      }

      // Fallback for current demo data that only has labels.
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (item?.date === "Today") return today;
      if (item?.date === "Yesterday") return new Date(today.getTime() - 24 * 60 * 60 * 1000);
      if (item?.date === "This Week") return new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
      return null;
    }, []);
  
    const filteredData = useMemo(() => {
      return DATA.filter((item) => {
        const matchesDate =
          selectedDateFilter === "Custom"
            ? (() => {
                if (!customDay) return true;
                const itemDate = getItemDate(item);
                if (!itemDate) return false;
                const itemMidnight = new Date(
                  itemDate.getFullYear(),
                  itemDate.getMonth(),
                  itemDate.getDate()
                );
                return itemMidnight.getTime() === customDay.getTime();
              })()
            : item.date === selectedDateFilter;
        const matchesLead = selectedLeadFilter === "All" ? true : item.lead === selectedLeadFilter;
        return matchesDate && matchesLead;
      });
    }, [customDay, getItemDate, selectedDateFilter, selectedLeadFilter]);

    const dateCounts = useMemo(() => {
      const counts = Object.fromEntries(DATE_FILTERS.map((d) => [d, 0]));
      for (const item of DATA) {
        const matchesLead = selectedLeadFilter === "All" ? true : item.lead === selectedLeadFilter;
        if (matchesLead && counts[item.date] !== undefined) counts[item.date] += 1;
      }
      if (counts.Custom !== undefined) {
        if (!customDay) counts.Custom = 0;
        else {
          let c = 0;
          for (const item of DATA) {
            const matchesLead = selectedLeadFilter === "All" ? true : item.lead === selectedLeadFilter;
            if (!matchesLead) continue;
            const itemDate = getItemDate(item);
            if (!itemDate) continue;
            const itemMidnight = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
            if (itemMidnight.getTime() === customDay.getTime()) c += 1;
          }
          counts.Custom = c;
        }
      }
      return counts;
    }, [DATE_FILTERS, customDay, getItemDate, selectedLeadFilter]);

    const leadCounts = useMemo(() => {
      const counts = Object.fromEntries(LEAD_FILTERS.map((l) => [l, 0]));
      for (const item of DATA) {
        const matchesDate =
          selectedDateFilter === "Custom"
            ? (() => {
                if (!customDay) return true;
                const itemDate = getItemDate(item);
                if (!itemDate) return false;
                const itemMidnight = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
                return itemMidnight.getTime() === customDay.getTime();
              })()
            : item.date === selectedDateFilter;
        if (!matchesDate) continue;
        counts.All += 1;
        if (counts[item.lead] !== undefined) counts[item.lead] += 1;
      }
      return counts;
    }, [LEAD_FILTERS, customDay, getItemDate, selectedDateFilter]);
  
    const getLeadColor = (lead) => {
      if (lead === "Hot") return "#ef4444";
      if (lead === "Warm") return "#f59e0b";
      return "#06b6d4";
    };

    const topPadding = useMemo(() => {
      // removes the "big gap" while staying safe under the notch/status bar
      return Math.max(insets.top + 12, 12);
    }, [insets.top]);

    const screenAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (Platform.OS === "android") {
        UIManager.setLayoutAnimationEnabledExperimental?.(true);
      }
      Animated.timing(screenAnim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }).start();
    }, [screenAnim]);
  
    return (
      <View style={[styles.container, { paddingTop: topPadding }]}>
        <Animated.View
          style={{
            opacity: screenAnim,
            transform: [
              {
                translateY: screenAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          }}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Clients</Text>
            <Text style={styles.subtitle}>
              {filteredData.length} client{filteredData.length === 1 ? "" : "s"} • Manage all client records
            </Text>
          </View>

          {/* SEARCH */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#94a3b8" />

            <TextInput
              placeholder="Search clients..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
            />

            <TouchableOpacity activeOpacity={0.8} style={styles.searchAction}>
              <Ionicons name="options-outline" size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* FILTERS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {DATE_FILTERS.map((item) => {
              const isActive = selectedDateFilter === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.filterButton, isActive && styles.activeFilter]}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setSelectedDateFilter(item);
                    if (item !== "Custom") {
                      setCustomDate("");
                      setCustomDay(null);
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.filterText, isActive && styles.activeFilterText]}>{item}</Text>
                  <View style={[styles.filterCount, isActive && styles.filterCountActive]}>
                    <Text style={[styles.filterCountText, isActive && styles.filterCountTextActive]}>
                      {dateCounts[item] ?? 0}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {selectedDateFilter === "Custom" && (
            <View style={styles.customRangeBox}>
              <Pressable
                style={styles.rangePickRow}
                onPress={() => {
                  setDraftDate(customDate || null);
                  setIsCalendarOpen(true);
                }}
              >
                <View style={styles.rangePickLeft}>
                  <Ionicons name="calendar-outline" size={18} color="#64748b" />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.rangePickTitle}>Date</Text>
                    <Text style={styles.rangePickValue} numberOfLines={1}>
                      {customDay ? customDate : "Pick from calendar"}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
              </Pressable>

              <View style={styles.customActions}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.customPrimary}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    // keep for UI consistency; calendar sets the date immediately
                  }}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.customPrimaryText}>OK</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.customGhost}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setCustomDate("");
                    setCustomDay(null);
                  }}
                >
                  <Ionicons name="close" size={16} color="#334155" />
                  <Text style={styles.customGhostText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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
                  <Text style={styles.modalSubtitle}>
                    Tap any date to select
                  </Text>
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
                  onPress={() => {
                    setDraftDate(null);
                  }}
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
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

          {/* LEAD FILTERS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {LEAD_FILTERS.map((item) => {
              const isActive = selectedLeadFilter === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.filterButton, isActive && styles.activeFilter]}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setSelectedLeadFilter(item);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.filterText, isActive && styles.activeFilterText]}>{item}</Text>
                  <View style={[styles.filterCount, isActive && styles.filterCountActive]}>
                    <Text style={[styles.filterCountText, isActive && styles.filterCountTextActive]}>
                      {leadCounts[item] ?? 0}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* LIST */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 110,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.card}
              onPress={() => {
                router.push(`/(drawer)/clients/${item.id}`);
              }}
            >
              {/* TOP */}
              <View style={styles.cardTop}>
                <View style={styles.cardLeft}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {String(item.name || "?")
                        .trim()
                        .slice(0, 1)
                        .toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.primary}>
                    <Text style={styles.name} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.phone} numberOfLines={1}>
                      {item.phone}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  <View
                    style={[
                      styles.leadBadge,
                      { backgroundColor: getLeadColor(item.lead) },
                    ]}
                  >
                    <Text style={styles.leadText}>{item.lead}</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                </View>
              </View>

              {/* META */}
              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Ionicons name="location-outline" size={14} color="#64748b" />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>

                <View style={styles.metaChip}>
                  <Ionicons
                    name={item.type === "Incoming" ? "call-outline" : "return-down-forward-outline"}
                    size={14}
                    color="#64748b"
                  />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {item.type}
                  </Text>
                </View>

                <View style={styles.metaChipGhost}>
                  <Ionicons name="time-outline" size={14} color="#94a3b8" />
                  <Text style={styles.metaTextGhost}>{item.date}</Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.bookBtn}
                onPress={() => {
                  router.push({
                    pathname: "/(drawer)/(tabs)/appointments",
                    params: { openSheet: "1", name: item.name, phone: item.phone },
                  });
                }}
              >
                <Ionicons name="calendar-outline" size={16} color="#0f172a" />
                <Text style={styles.bookBtnText}>Book Appointment</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
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
      marginBottom: 18,
    },
  
    title: {
      fontSize: 32,
      fontWeight: "800",
      color: "#0f172a",
      letterSpacing: -0.4,
    },
  
    subtitle: {
      color: "#64748b",
      marginTop: 6,
      fontSize: 15,
    },
  
    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ffffff",
      paddingHorizontal: 14,
      borderRadius: 16,
      height: 54,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#e2e8f0",
    },
  
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 15,
      color: "#0f172a",
      fontWeight: "600",
    },

    searchAction: {
      height: 34,
      width: 34,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f1f5f9",
      borderWidth: 1,
      borderColor: "#e2e8f0",
    },
  
    filterRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingRight: 12,
      marginBottom: 12,
    },
  
    filterButton: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: "#f1f5f9",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  
    activeFilter: {
      backgroundColor: "#0f172a",
      borderColor: "#0f172a",
    },
  
    filterText: {
      color: "#0f172a",
      fontWeight: "600",
    },
  
    activeFilterText: {
      color: "#fff",
    },

    filterCount: {
      minWidth: 22,
      paddingHorizontal: 7,
      height: 20,
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
      fontWeight: "800",
      fontSize: 12,
    },

    filterCountTextActive: {
      color: "#fff",
    },

    customRangeBox: {
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 18,
      padding: 12,
      marginBottom: 12,
    },

    rangePickRow: {
      height: 48,
      borderRadius: 16,
      backgroundColor: "#f8fafc",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    rangePickLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
      minWidth: 0,
      paddingRight: 10,
    },

    rangePickTitle: {
      color: "#0f172a",
      fontWeight: "900",
      fontSize: 13,
    },

    rangePickValue: {
      color: "#64748b",
      fontWeight: "700",
      fontSize: 12.5,
      marginTop: 2,
    },

    customActions: {
      marginTop: 10,
      flexDirection: "row",
      gap: 10,
    },

    customPrimary: {
      flex: 1,
      height: 44,
      borderRadius: 14,
      backgroundColor: "#0f172a",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },

    customPrimaryText: {
      color: "#fff",
      fontWeight: "900",
    },

    customGhost: {
      flex: 1,
      height: 44,
      borderRadius: 14,
      backgroundColor: "#f1f5f9",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },

    customGhostText: {
      color: "#334155",
      fontWeight: "900",
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
      padding: 12,
      marginBottom: 12,
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
      justifyContent: "space-between",
      alignItems: "center",
    },

    cardLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      paddingRight: 10,
    },

    avatar: {
      height: 40,
      width: 40,
      borderRadius: 14,
      backgroundColor: "#eef2ff",
      borderWidth: 1,
      borderColor: "#e0e7ff",
      alignItems: "center",
      justifyContent: "center",
    },

    avatarText: {
      color: "#3730a3",
      fontWeight: "900",
      fontSize: 15,
      letterSpacing: 0.4,
    },

    primary: {
      marginLeft: 10,
      flex: 1,
      minWidth: 0,
    },

    cardRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  
    name: {
      fontSize: 16.5,
      fontWeight: "800",
      color: "#0f172a",
    },
  
    phone: {
      color: "#64748b",
      marginTop: 2,
      fontWeight: "600",
      fontSize: 12.5,
    },
  
    leadBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
    },
  
    leadText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 11.5,
    },

    metaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 10,
    },

    metaChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 9,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: "#f1f5f9",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      maxWidth: "48%",
    },

    metaText: {
      color: "#334155",
      fontWeight: "700",
      fontSize: 12,
    },

    metaChipGhost: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 9,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#f1f5f9",
    },

    metaTextGhost: {
      color: "#94a3b8",
      fontWeight: "700",
      fontSize: 12,
    },

    bookBtn: {
      marginTop: 10,
      height: 42,
      borderRadius: 14,
      backgroundColor: "#f1f5f9",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    bookBtnText: {
      color: "#0f172a",
      fontWeight: "900",
    },
  });