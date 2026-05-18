import React, { forwardRef, useEffect, useMemo, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "react-native-calendars";

const AddAppointmentSheet = forwardRef(
  ({ prefill, onSave }, ref) => {
    const snapPoints = useMemo(() => ["90%"], []);

    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [appointmentType, setAppointmentType] = useState("Online");
    const [clientType, setClientType] = useState("New");
    const [status, setStatus] = useState("Pending");
    const [fee, setFee] = useState("");
    const [notes, setNotes] = useState("");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
      if (prefill) {
        setClientName(prefill.name || "");
        setClientPhone(prefill.phone || "");
      }
    }, [prefill]);

    const handleSave = () => {
      if (!clientName.trim()) {
        Alert.alert("Error", "Please enter client name");
        return;
      }
      if (!appointmentDate.trim()) {
        Alert.alert("Error", "Please select appointment date");
        return;
      }
      if (!appointmentTime.trim()) {
        Alert.alert("Error", "Please enter appointment time");
        return;
      }

      const appointmentData = {
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        date: appointmentDate,
        time: appointmentTime,
        type: appointmentType,
        clientType: clientType,
        status: status,
        fee: fee || "0",
        notes: notes.trim(),
      };

      onSave?.(appointmentData);
      resetForm();
      ref.current?.close();
      Alert.alert("Success", "Appointment scheduled successfully!");
    };

    const resetForm = () => {
      setAppointmentDate("");
      setAppointmentTime("");
      setAppointmentType("Online");
      setClientType("New");
      setStatus("Pending");
      setFee("");
      setNotes("");
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        keyboardBehavior="interactive"
        backgroundStyle={styles.sheetBackground}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Schedule Appointment</Text>
            <Text style={styles.subtitle}>Fill in the details below</Text>
          </View>

          {/* CLIENT INFO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Client Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color="#3b82f6" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter client name"
                  placeholderTextColor="#94a3b8"
                  value={clientName}
                  onChangeText={setClientName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={18} color="#3b82f6" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  placeholderTextColor="#94a3b8"
                  value={clientPhone}
                  onChangeText={setClientPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* APPOINTMENT DETAILS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment Details</Text>

            {/* DATE PICKER */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setIsCalendarOpen(true)}
              >
                <Ionicons name="calendar-outline" size={18} color="#3b82f6" />
                <View style={styles.datePickerContent}>
                  <Text style={styles.datePickerLabel}>Select Date</Text>
                  <Text style={styles.datePickerValue}>
                    {appointmentDate || "Tap to select date"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time (HH:MM)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="time-outline" size={18} color="#3b82f6" />
                <TextInput
                  style={styles.input}
                  placeholder="10:30"
                  placeholderTextColor="#94a3b8"
                  value={appointmentTime}
                  onChangeText={setAppointmentTime}
                />
              </View>
            </View>

            {/* TYPE, CLIENT TYPE & STATUS ROW */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Type</Text>
                <View style={styles.buttonGroup}>
                  {["Online", "Offline"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        appointmentType === type && styles.typeButtonActive,
                      ]}
                      onPress={() => setAppointmentType(type)}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          appointmentType === type && styles.typeButtonTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.label}>Client</Text>
                <View style={styles.buttonGroup}>
                  {["New", "Old"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        clientType === type && styles.typeButtonActive,
                      ]}
                      onPress={() => setClientType(type)}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          clientType === type && styles.typeButtonTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* STATUS */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.buttonGroup}>
                {["Pending", "Confirmed"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.typeButton,
                      status === s && styles.typeButtonActive,
                    ]}
                    onPress={() => setStatus(s)}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        status === s && styles.typeButtonTextActive,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* ADDITIONAL INFO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fee (Optional)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="cash-outline" size={18} color="#3b82f6" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter fee amount"
                  placeholderTextColor="#94a3b8"
                  value={fee}
                  onChangeText={setFee}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Add any notes or remarks..."
                placeholderTextColor="#94a3b8"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => ref.current?.close()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <LinearGradient
              colors={["#3b82f6", "#2563eb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButtonGradient}
            >
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save Appointment</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

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
                  current={appointmentDate || new Date().toISOString().split("T")[0]}
                  onDayPress={(day) => {
                    setAppointmentDate(day.dateString);
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
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

AddAppointmentSheet.displayName = "AddAppointmentSheet";

export default AddAppointmentSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#fff",
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 10,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "600",
  },

  notesInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 100,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },

  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },

  typeButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },

  typeButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },

  typeButtonTextActive: {
    color: "#fff",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
  },

  saveButtonGradient: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },

  saveButton: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },

  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },

  datePickerContent: {
    flex: 1,
  },

  datePickerLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: 2,
  },

  datePickerValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
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
