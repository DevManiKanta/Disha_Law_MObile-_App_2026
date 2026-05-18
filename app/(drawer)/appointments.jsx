import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Calendar } from "react-native-calendars";

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useState([
    {
      id: "1",
      clientName: "John Doe",
      clientPhone: "9876543210",
      date: "2026-05-20",
      time: "10:30",
      type: "Online",
      clientType: "New",
      status: "Confirmed",
      fee: "500",
      notes: "Discuss corporate restructuring",
    },
    {
      id: "2",
      clientName: "Sarah Smith",
      clientPhone: "9999999999",
      date: "2026-05-21",
      time: "14:00",
      type: "Offline",
      clientType: "Old",
      status: "Pending",
      fee: "750",
      notes: "Family law consultation",
    },
    {
      id: "3",
      clientName: "Michael Brown",
      clientPhone: "8888888888",
      date: "2026-05-22",
      time: "11:15",
      type: "Online",
      clientType: "New",
      status: "Confirmed",
      fee: "600",
      notes: "Real estate dispute",
    },
    {
      id: "4",
      clientName: "Emma Wilson",
      clientPhone: "7777777777",
      date: "2026-05-20",
      time: "15:45",
      type: "Online",
      clientType: "Old",
      status: "Confirmed",
      fee: "550",
      notes: "Contract review",
    },
    {
      id: "5",
      clientName: "David Kumar",
      clientPhone: "8765432109",
      date: "2026-05-20",
      time: "09:00",
      type: "Offline",
      clientType: "New",
      status: "Confirmed",
      fee: "800",
      notes: "Initial consultation - Criminal case",
    },
    {
      id: "6",
      clientName: "Priya Sharma",
      clientPhone: "9123456789",
      date: "2026-05-21",
      time: "11:30",
      type: "Online",
      clientType: "Old",
      status: "Confirmed",
      fee: "450",
      notes: "Follow-up on property dispute",
    },
    {
      id: "7",
      clientName: "Rajesh Patel",
      clientPhone: "9876123456",
      date: "2026-05-22",
      time: "16:00",
      type: "Offline",
      clientType: "Old",
      status: "Pending",
      fee: "700",
      notes: "Business partnership agreement",
    },
    {
      id: "8",
      clientName: "Anjali Verma",
      clientPhone: "9988776655",
      date: "2026-05-23",
      time: "13:30",
      type: "Online",
      clientType: "New",
      status: "Confirmed",
      fee: "550",
      notes: "Divorce settlement discussion",
    },
    {
      id: "9",
      clientName: "Vikram Singh",
      clientPhone: "9876549876",
      date: "2026-05-20",
      time: "12:00",
      type: "Online",
      clientType: "New",
      status: "Pending",
      fee: "600",
      notes: "Tax compliance consultation",
    },
    {
      id: "10",
      clientName: "Neha Gupta",
      clientPhone: "9765432198",
      date: "2026-05-24",
      time: "10:15",
      type: "Offline",
      clientType: "Old",
      status: "Confirmed",
      fee: "650",
      notes: "Will and testament preparation",
    },
    {
      id: "11",
      clientName: "Arjun Reddy",
      clientPhone: "9654321987",
      date: "2026-05-21",
      time: "15:30",
      type: "Online",
      clientType: "New",
      status: "Confirmed",
      fee: "500",
      notes: "Employment dispute resolution",
    },
    {
      id: "12",
      clientName: "Meera Iyer",
      clientPhone: "9543210876",
      date: "2026-05-22",
      time: "14:45",
      type: "Offline",
      clientType: "Old",
      status: "Confirmed",
      fee: "750",
      notes: "Intellectual property rights",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterClientType, setFilterClientType] = useState("All");

  const filteredAppointments = appointments.filter((apt) => {
    const dateMatch = apt.date === selectedDate;
    const statusMatch = filterStatus === "All" || apt.status === filterStatus;
    const typeMatch = filterType === "All" || apt.type === filterType;
    const clientTypeMatch = filterClientType === "All" || apt.clientType === filterClientType;
    return dateMatch && statusMatch && typeMatch && clientTypeMatch;
  });

  const getStatusColor = (status) => {
    if (status === "Confirmed") return { bg: "#ecfdf5", text: "#10b981" };
    if (status === "Pending") return { bg: "#fef3c7", text: "#f59e0b" };
    return { bg: "#fee2e2", text: "#ef4444" };
  };

  const getTypeColor = (type) => {
    return type === "Online" ? "#3b82f6" : "#8b5cf6";
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top + 16, 16),
          paddingBottom: Math.max(insets.bottom + 20, 20),
        },
      ]}
    >
      {/* HEADER */}
      <Animated.View style={styles.header} entering={FadeInUp.duration(600)}>
        <Text style={styles.greeting}>Appointments</Text>
        <Text style={styles.title}>All Scheduled Meetings</Text>
      </Animated.View>

      {/* CALENDAR BUTTON */}
      <Animated.View
        style={styles.calendarButtonSection}
        entering={FadeInUp.duration(600).delay(100)}
      >
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => setIsCalendarOpen(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
          <View style={styles.calendarButtonText}>
            <Text style={styles.calendarButtonLabel}>Select Date</Text>
            <Text style={styles.calendarButtonValue}>{formatDate(selectedDate)}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </Animated.View>

      {/* STATUS FILTER */}
      <Animated.View
        style={styles.filterSection}
        entering={FadeInUp.duration(600).delay(200)}
      >
        <Text style={styles.filterLabel}>Status</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {["All", "Confirmed", "Pending"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filterStatus === status && styles.filterButtonActive,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterStatus === status && styles.filterButtonTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* TYPE FILTER */}
      <Animated.View
        style={styles.filterSection}
        entering={FadeInUp.duration(600).delay(250)}
      >
        <Text style={styles.filterLabel}>Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {["All", "Online", "Offline"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                filterType === type && styles.filterButtonActive,
              ]}
              onPress={() => setFilterType(type)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === type && styles.filterButtonTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* CLIENT TYPE FILTER */}
      <Animated.View
        style={styles.filterSection}
        entering={FadeInUp.duration(600).delay(300)}
      >
        <Text style={styles.filterLabel}>Client</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {["All", "New", "Old"].map((clientType) => (
            <TouchableOpacity
              key={clientType}
              style={[
                styles.filterButton,
                filterClientType === clientType && styles.filterButtonActive,
              ]}
              onPress={() => setFilterClientType(clientType)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterClientType === clientType && styles.filterButtonTextActive,
                ]}
              >
                {clientType}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* APPOINTMENTS LIST */}
      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const statusColor = getStatusColor(item.status);
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
                      <Text style={styles.appointmentType}>
                        {item.type} • {item.clientType} Client
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                    <Text style={[styles.statusText, { color: statusColor.text }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color="#64748b" />
                    <Text style={styles.detailText}>{item.time}</Text>
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

                <View style={styles.cardDivider} />
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="call-outline" size={16} color="#ef4444" />
                    <Text style={styles.actionButtonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={16} color="#3b82f6" />
                    <Text style={styles.actionButtonText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="pencil-outline" size={16} color="#f59e0b" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          );
        }}
      />

      {filteredAppointments.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color="#94a3b8" />
          <Text style={styles.emptyTitle}>No appointments found</Text>
          <Text style={styles.emptySubtitle}>Try selecting a different date or filter</Text>
        </View>
      )}

      {/* CALENDAR MODAL */}
      <Modal
        visible={isCalendarOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCalendarOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                onPress={() => setIsCalendarOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <Calendar
              current={selectedDate}
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setIsCalendarOpen(false);
              }}
              theme={{
                backgroundColor: "#fff",
                calendarBackground: "#fff",
                textSectionTitleColor: "#0f172a",
                selectedDayBackgroundColor: "#3b82f6",
                selectedDayTextColor: "#fff",
                todayTextColor: "#3b82f6",
                dayTextColor: "#0f172a",
                textDisabledColor: "#cbd5e1",
                monthTextColor: "#0f172a",
                arrowColor: "#3b82f6",
                textMonthFontWeight: "800",
                textDayFontWeight: "600",
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
  },

  header: {
    marginBottom: 20,
  },

  greeting: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
  },

  calendarButtonSection: {
    marginBottom: 16,
  },

  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  calendarButtonText: {
    flex: 1,
  },

  calendarButtonLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  calendarButtonValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0f172a",
  },

  filterSection: {
    marginBottom: 12,
  },

  filterLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  filterRow: {
    gap: 6,
    paddingBottom: 4,
  },

  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  filterButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },

  filterButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
  },

  filterButtonTextActive: {
    color: "#fff",
  },

  listContent: {
    paddingBottom: 20,
  },

  appointmentCard: {
    marginBottom: 12,
    borderRadius: 14,
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
    borderRadius: 14,
    padding: 12,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  cardInfo: {
    flex: 1,
  },

  clientName: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 2,
  },

  appointmentType: {
    fontSize: 11,
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
    marginVertical: 8,
  },

  cardDetails: {
    gap: 6,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  detailText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
  },

  notesSection: {
    marginTop: 2,
  },

  notesLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94a3b8",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  notesText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "500",
    lineHeight: 16,
  },

  actionButtons: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "space-around",
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#f8fafc",
  },

  actionButtonText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#334155",
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0f172a",
    marginTop: 12,
  },

  emptySubtitle: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
  },

  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
});
