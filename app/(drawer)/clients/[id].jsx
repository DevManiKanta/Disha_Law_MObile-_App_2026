import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
  Clipboard,
  Modal,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import AddAppointmentSheet from "../../components/AddAppointmentSheet";

// Sample client data - in real app, fetch from API/database
const CLIENTS_DATA = {
  "1": {
    id: "1",
    name: "John Doe",
    phone: "9876543210",
    location: "HYD",
    lead: "Hot",
    type: "Incoming",
    date: "Today",
    email: "john.doe@example.com",
    caseType: "Corporate Law",
    reference: "LinkedIn",
    remarks: "Interested in corporate restructuring services",
    appointments: 3,
    followups: 2,
    lastContact: "Today at 10:30 AM",
  },
  "2": {
    id: "2",
    name: "Sarah Smith",
    phone: "9999999999",
    location: "Chicago",
    lead: "Warm",
    type: "Outgoing",
    date: "Yesterday",
    email: "sarah.smith@example.com",
    caseType: "Family Law",
    reference: "Referral",
    remarks: "Seeking legal advice for divorce proceedings",
    appointments: 2,
    followups: 1,
    lastContact: "Yesterday at 2:15 PM",
  },
  "3": {
    id: "3",
    name: "Michael Brown",
    phone: "8888888888",
    location: "Texas",
    lead: "Cold",
    type: "Incoming",
    date: "This Week",
    email: "michael.brown@example.com",
    caseType: "Real Estate",
    reference: "Google Search",
    remarks: "Inquiry about property dispute resolution",
    appointments: 1,
    followups: 0,
    lastContact: "3 days ago",
  },
};

export default function ClientDetailsScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const params = useLocalSearchParams();
  const appointmentSheetRef = useRef(null);
  const [showPhoneOptions, setShowPhoneOptions] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpMessage, setFollowUpMessage] = useState("");
  const [followUps, setFollowUps] = useState([]);

  const clientId = params?.id;
  const client = useMemo(() => {
    return CLIENTS_DATA[clientId] || CLIENTS_DATA["1"];
  }, [clientId]);

  useEffect(() => {
    nav.setOptions?.({ title: client.name });
  }, [nav, client.name]);

  const handleCall = () => {
    const phoneNumber = client.phone.replace(/\D/g, ""); // Remove non-digits
    const phoneUrl = `tel:${phoneNumber}`;
    
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          // Fallback: Copy to clipboard and show alert
          Clipboard.setString(client.phone);
          Alert.alert(
            "Phone Number Copied",
            `Phone number copied to clipboard:\n${client.phone}\n\nYou can now paste it in your phone dialer.`,
            [{ text: "OK" }]
          );
        }
      })
      .catch((err) => {
        // Fallback: Copy to clipboard
        Clipboard.setString(client.phone);
        Alert.alert(
          "Phone Number Copied",
          `Unable to open dialer directly.\n\nPhone number copied to clipboard:\n${client.phone}\n\nYou can now paste it in your phone dialer.`,
          [{ text: "OK" }]
        );
        console.error("Call error:", err);
      });
  };

  const handleWhatsApp = () => {
    const phoneNumber = client.phone.replace(/\D/g, ""); // Remove non-digits
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert(
            "WhatsApp Not Available",
            "WhatsApp is not installed on your device.",
            [{ text: "OK" }]
          );
        }
      })
      .catch((err) => {
        Alert.alert(
          "Error",
          "Unable to open WhatsApp. Please try again.",
          [{ text: "OK" }]
        );
        console.error("WhatsApp error:", err);
      });
  };

  const handleEmail = () => {
    const emailUrl = `mailto:${client.email}`;
    
    Linking.canOpenURL(emailUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(emailUrl);
        } else {
          Alert.alert(
            "Email Not Available",
            "No email client is configured on your device.",
            [{ text: "OK" }]
          );
        }
      })
      .catch((err) => {
        Alert.alert(
          "Error",
          "Unable to open email client. Please try again.",
          [{ text: "OK" }]
        );
        console.error("Email error:", err);
      });
  };

  const handleSaveFollowUp = () => {
    if (!followUpMessage.trim()) {
      Alert.alert("Error", "Please enter a follow-up message");
      return;
    }

    const newFollowUp = {
      id: Date.now().toString(),
      clientName: client.name,
      clientId: client.id,
      message: followUpMessage,
      timestamp: new Date().toLocaleString(),
      date: new Date(),
    };

    setFollowUps([newFollowUp, ...followUps]);
    setFollowUpMessage("");
    setShowFollowUpModal(false);
    Alert.alert("Success", "Follow-up saved successfully!");
  };

  const getLeadColor = (lead) => {
    if (lead === "Hot") return { bg: "#fef2f2", text: "#ef4444", icon: "#dc2626" };
    if (lead === "Warm") return { bg: "#fffbf0", text: "#f59e0b", icon: "#d97706" };
    return { bg: "#ecf9ff", text: "#06b6d4", icon: "#0891b2" };
  };

  const leadColor = getLeadColor(client.lead);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top + 16, 16),
          paddingBottom: Math.max(insets.bottom + 20, 20),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER CARD */}
      <Animated.View
        style={styles.headerCard}
        entering={FadeInDown.duration(600)}
      >
        <LinearGradient
          colors={["#3b82f6", "#2563eb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {client.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.clientName}>{client.name}</Text>
            <Text style={styles.clientLocation}>
              <Ionicons name="location" size={14} color="#fff" /> {client.location}
            </Text>
          </View>

          <View style={[styles.leadBadgeLarge, { backgroundColor: leadColor.bg }]}>
            <Text style={[styles.leadBadgeText, { color: leadColor.text }]}>
              {client.lead}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* QUICK ACTIONS */}
      <Animated.View
        style={styles.quickActions}
        entering={FadeInUp.duration(600).delay(100)}
      >
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCall}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#ef4444", "#dc2626"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}
          >
            <Ionicons name="call" size={28} color="#fff" />
            <Text style={styles.actionLabel}>Call Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleWhatsApp}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#10b981", "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#fff" />
            <Text style={styles.actionLabel}>WhatsApp</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleEmail}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#f59e0b", "#d97706"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}
          >
            <Ionicons name="mail" size={24} color="#fff" />
            <Text style={styles.actionLabel}>Email</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* CONTACT INFO */}
      <Animated.View
        style={styles.section}
        entering={FadeInUp.duration(600).delay(200)}
      >
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <View style={styles.infoCard}>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <View style={styles.infoIcon}>
              <Ionicons name="call-outline" size={20} color="#ef4444" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{client.phone}</Text>
            </View>
            <View style={styles.callIconContainer}>
              <Ionicons name="call" size={18} color="#ef4444" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.infoRow}
            onPress={handleEmail}
            activeOpacity={0.7}
          >
            <View style={styles.infoIcon}>
              <Ionicons name="mail-outline" size={20} color="#f59e0b" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{client.email}</Text>
            </View>
            <View style={styles.callIconContainer}>
              <Ionicons name="open-outline" size={18} color="#f59e0b" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="location-outline" size={20} color="#3b82f6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{client.location}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* CASE DETAILS */}
      <Animated.View
        style={styles.section}
        entering={FadeInUp.duration(600).delay(300)}
      >
        <Text style={styles.sectionTitle}>Case Details</Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <View style={styles.detailIcon}>
              <Ionicons name="briefcase-outline" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.detailLabel}>Case Type</Text>
            <Text style={styles.detailValue}>{client.caseType}</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailIcon}>
              <Ionicons name="people-outline" size={20} color="#10b981" />
            </View>
            <Text style={styles.detailLabel}>Reference</Text>
            <Text style={styles.detailValue}>{client.reference}</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailIcon}>
              <Ionicons name="call-outline" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.detailLabel}>Call Type</Text>
            <Text style={styles.detailValue}>{client.type}</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailIcon}>
              <Ionicons name="time-outline" size={20} color="#8b5cf6" />
            </View>
            <Text style={styles.detailLabel}>Last Contact</Text>
            <Text style={styles.detailValue}>{client.lastContact}</Text>
          </View>
        </View>
      </Animated.View>

      {/* ACTIVITY STATS */}
      <Animated.View
        style={styles.section}
        entering={FadeInUp.duration(600).delay(400)}
      >
        <Text style={styles.sectionTitle}>Activity</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statNumber}>
              <Text style={styles.statValue}>{client.appointments}</Text>
            </View>
            <Text style={styles.statLabel}>Appointments</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statNumber}>
              <Text style={styles.statValue}>{client.followups}</Text>
            </View>
            <Text style={styles.statLabel}>Follow-ups</Text>
          </View>
        </View>
      </Animated.View>

      {/* REMARKS */}
      <Animated.View
        style={styles.section}
        entering={FadeInUp.duration(600).delay(500)}
      >
        <Text style={styles.sectionTitle}>Remarks</Text>

        <View style={styles.remarksCard}>
          <Text style={styles.remarksText}>{client.remarks}</Text>
        </View>
      </Animated.View>

      {/* ACTION BUTTONS */}
      <Animated.View
        style={styles.actionButtons}
        entering={FadeInUp.duration(600).delay(600)}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => appointmentSheetRef.current?.expand()}
        >
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Schedule Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowFollowUpModal(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#3b82f6" />
          <Text style={styles.secondaryButtonText}>Add Follow-up</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* FOLLOW-UP MODAL */}
      <Modal
        visible={showFollowUpModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFollowUpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={styles.modalContent}
            entering={FadeInUp.duration(400)}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Follow-up</Text>
              <TouchableOpacity
                onPress={() => setShowFollowUpModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Follow-up Message</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your follow-up message..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={5}
                value={followUpMessage}
                onChangeText={setFollowUpMessage}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowFollowUpModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveFollowUp}
              >
                <Ionicons name="checkmark" size={18} color="#fff" />
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <AddAppointmentSheet
        ref={appointmentSheetRef}
        prefill={{
          mode: "New",
          name: client.name,
          phone: client.phone,
        }}
        onSave={(data) => {
          appointmentSheetRef.current?.close();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  content: {
    paddingHorizontal: 16,
  },

  headerCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },

  headerGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  avatarLargeText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },

  headerInfo: {
    flex: 1,
  },

  clientName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 6,
  },

  clientLocation: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },

  leadBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },

  leadBadgeText: {
    fontWeight: "800",
    fontSize: 12,
  },

  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  actionGradient: {
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  actionLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 12,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },

  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "700",
  },

  callIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
  },

  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  detailCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },

  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  detailLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "700",
    textAlign: "center",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },

  statNumber: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#3b82f6",
  },

  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },

  remarksCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  remarksText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
    lineHeight: 20,
  },

  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },

  primaryButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  secondaryButton: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "#bfdbfe",
  },

  secondaryButtonText: {
    color: "#3b82f6",
    fontWeight: "800",
    fontSize: 15,
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
    maxHeight: "80%",
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

  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  modalLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  modalInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "500",
    minHeight: 120,
  },

  modalFooter: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCancelText: {
    color: "#334155",
    fontWeight: "800",
    fontSize: 14,
  },

  modalSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  modalSaveText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
});
