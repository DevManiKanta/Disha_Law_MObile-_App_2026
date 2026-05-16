import React, { forwardRef, useEffect, useMemo, useState } from "react";
  
  import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
  
  import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
  
  import { Ionicons } from "@expo/vector-icons";
  import { Calendar } from "react-native-calendars";
  import DateTimePicker from "@react-native-community/datetimepicker";
  
  const AddAppointmentSheet = forwardRef(
    ({ prefill, variant = "appointment" }, ref) => {
      const snapPoints = useMemo(
        () => ["85%"],
        []
      );
  
      const [appointmentType, setAppointmentType] =
        useState("Online");
      const [clientMode, setClientMode] = useState("New"); // New | Old
      const [feeAmount, setFeeAmount] = useState("");
      const [paymentMethod, setPaymentMethod] = useState("Cash"); // Cash | Online
      const [clientName, setClientName] = useState("");
      const [clientPhone, setClientPhone] = useState("");
      const [callStatus, setCallStatus] = useState("Answered"); // Answered | Not Answered | Busy
      const [followupOutcome, setFollowupOutcome] = useState("Coming"); // Coming | Not Coming | Reschedule
      const [appointmentDate, setAppointmentDate] = useState(""); // YYYY-MM-DD
      const [isCalendarOpen, setIsCalendarOpen] = useState(false);
      const [draftDate, setDraftDate] = useState(null); // "YYYY-MM-DD" | null
      const [appointmentTime, setAppointmentTime] = useState(""); // e.g. 10:30 AM
      const [isTimeOpen, setIsTimeOpen] = useState(false);
      const [draftTime, setDraftTime] = useState(new Date());

      const SheetTextInput = Platform.OS === "web" ? TextInput : BottomSheetTextInput;

      const appointmentDateDisplay = useMemo(() => {
        if (!appointmentDate) return "";
        // YYYY-MM-DD -> DD/MM/YYYY
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(appointmentDate);
        if (!m) return appointmentDate;
        return `${m[3]}/${m[2]}/${m[1]}`;
      }, [appointmentDate]);

      const appointmentTimeDisplay = useMemo(() => {
        return appointmentTime || "";
      }, [appointmentTime]);

      const formatTime = (dateObj) => {
        try {
          return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch {
          return "";
        }
      };

      useEffect(() => {
        if (!prefill) return;
        if (prefill.mode === "Old") setClientMode("Old");
        if (prefill.mode === "New") setClientMode("New");
        if (typeof prefill.name === "string") setClientName(prefill.name);
        if (typeof prefill.phone === "string") setClientPhone(prefill.phone);
      }, [prefill]);
  
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
            <Text style={styles.title}>
              {variant === "followup" ? "Add Follow-up" : "Add Appointment"}
            </Text>
  
            {variant !== "followup" && (
              <>
                {/* TYPE */}
                <Text style={styles.label}>Appointment Type</Text>
                <View style={styles.row}>
                  {["Online", "Offline"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.optionButton, appointmentType === item && styles.activeButton]}
                      onPress={() => setAppointmentType(item)}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.optionText, appointmentType === item && styles.activeText]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
  
            {/* CLIENT MODE */}
            <Text style={styles.label}>Client</Text>
            <View style={styles.row}>
              {["New", "Old"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.optionButton, clientMode === item && styles.activeButton]}
                  onPress={() => setClientMode(item)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.optionText, clientMode === item && styles.activeText]}>
                    {item === "New" ? "New Client" : "Existing Client"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {clientMode === "Old" ? (
              <>
                <Text style={styles.label}>Select Client</Text>
                <SheetTextInput
                  placeholder="Search client name / phone"
                  style={styles.input}
                />
              </>
            ) : (
              <>
                {/* CLIENT NAME */}
                <Text style={styles.label}>Client Name</Text>
                <SheetTextInput
                  value={clientName}
                  onChangeText={setClientName}
                  placeholder="Enter client name"
                  style={styles.input}
                />

                {/* PHONE */}
                <Text style={styles.label}>Phone</Text>
                <SheetTextInput
                  value={clientPhone}
                  onChangeText={setClientPhone}
                  placeholder="Enter phone"
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </>
            )}

            {variant === "followup" ? (
              <>
                {/* CALL STATUS */}
                <Text style={styles.label}>Call Status</Text>
                <View style={styles.row}>
                  {["Answered", "Not Answered", "Busy"].map((item) => {
                    const isActive = callStatus === item;
                    return (
                      <TouchableOpacity
                        key={item}
                        style={[styles.optionButton, isActive && styles.activeButton]}
                        onPress={() => setCallStatus(item)}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.optionText, isActive && styles.activeText]}>{item}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* OUTCOME */}
                <Text style={styles.label}>Client Coming?</Text>
                <View style={styles.row}>
                  {["Coming", "Not Coming", "Reschedule"].map((item) => {
                    const isActive = followupOutcome === item;
                    return (
                      <TouchableOpacity
                        key={item}
                        style={[styles.optionButton, isActive && styles.activeButton]}
                        onPress={() => setFollowupOutcome(item)}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.optionText, isActive && styles.activeText]}>{item}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : (
              <>
                {/* DATE */}
                <Text style={styles.label}>Appointment Date</Text>
                <Pressable
                  style={styles.datePickRow}
                  onPress={() => {
                    setDraftDate(appointmentDate || null);
                    setIsCalendarOpen(true);
                  }}
                >
                  <View style={styles.datePickLeft}>
                    <Ionicons name="calendar-outline" size={18} color="#6b7280" />
                    <Text style={styles.datePickText}>
                      {appointmentDate ? appointmentDateDisplay : "Select date"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                </Pressable>

                {/* TIME */}
                <Text style={styles.label}>Appointment Time</Text>
                {Platform.OS === "web" ? (
                  <SheetTextInput
                    placeholder="10:30 AM"
                    value={appointmentTimeDisplay}
                    onChangeText={setAppointmentTime}
                    style={styles.input}
                  />
                ) : (
                  <>
                    <Pressable
                      style={styles.datePickRow}
                      onPress={() => {
                        setDraftTime(new Date());
                        setIsTimeOpen(true);
                      }}
                    >
                      <View style={styles.datePickLeft}>
                        <Ionicons name="time-outline" size={18} color="#6b7280" />
                        <Text style={styles.datePickText}>
                          {appointmentTime ? appointmentTimeDisplay : "Select time"}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                    </Pressable>

                    {/* Android shows native dialog when rendered */}
                    {Platform.OS === "android" && isTimeOpen && (
                      <DateTimePicker
                        value={draftTime}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={(event, selectedDate) => {
                          if (event?.type === "dismissed") {
                            setIsTimeOpen(false);
                            return;
                          }
                          const dt = selectedDate || draftTime;
                          setDraftTime(dt);
                          setAppointmentTime(formatTime(dt));
                          setIsTimeOpen(false);
                        }}
                      />
                    )}

                    {/* iOS in modal */}
                    {Platform.OS === "ios" && (
                      <Modal
                        visible={isTimeOpen}
                        animationType="slide"
                        transparent
                        onRequestClose={() => setIsTimeOpen(false)}
                      >
                        <Pressable style={styles.modalBackdrop} onPress={() => setIsTimeOpen(false)} />
                        <View style={styles.modalSheet}>
                          <View style={styles.modalHeader}>
                            <View>
                              <Text style={styles.modalTitle}>Select time</Text>
                              <Text style={styles.modalSubtitle}>Pick appointment time</Text>
                            </View>
                            <TouchableOpacity
                              activeOpacity={0.85}
                              style={styles.modalClose}
                              onPress={() => setIsTimeOpen(false)}
                            >
                              <Ionicons name="close" size={18} color="#0f172a" />
                            </TouchableOpacity>
                          </View>

                          <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
                            <DateTimePicker
                              value={draftTime}
                              mode="time"
                              is24Hour={false}
                              display="spinner"
                              onChange={(_, selectedDate) => {
                                if (!selectedDate) return;
                                setDraftTime(selectedDate);
                              }}
                            />
                          </View>

                          <View style={styles.modalFooter}>
                            <TouchableOpacity
                              activeOpacity={0.9}
                              style={styles.modalGhost}
                              onPress={() => setIsTimeOpen(false)}
                            >
                              <Text style={styles.modalGhostText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              activeOpacity={0.9}
                              style={styles.modalPrimary}
                              onPress={() => {
                                setAppointmentTime(formatTime(draftTime));
                                setIsTimeOpen(false);
                              }}
                            >
                              <Text style={styles.modalPrimaryText}>Use time</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    )}
                  </>
                )}
              </>
            )}

            {/* FEE */}
            <Text style={styles.label}>Fee Amount</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="cash-outline" size={18} color="#6b7280" />
              <SheetTextInput
                value={feeAmount}
                onChangeText={setFeeAmount}
                placeholder="₹0"
                keyboardType="numeric"
                style={styles.inputInline}
              />
            </View>

            {/* PAYMENT METHOD */}
            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.row}>
              {["Cash", "Online"].map((item) => {
                const isActive = paymentMethod === item;
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.optionButton, isActive && styles.activeButton]}
                    onPress={() => setPaymentMethod(item)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.optionText, isActive && styles.activeText]}>
                      {item === "Online" ? "Online Payment" : "Cash"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
  
            {/* REMARKS */}
            <Text style={styles.label}>
              Remarks
            </Text>
  
            <SheetTextInput
              multiline
              numberOfLines={4}
              placeholder="Enter remarks"
              style={styles.textArea}
            />
  
            {/* SAVE */}
            <TouchableOpacity
              style={styles.saveButton}
            >
              <Ionicons
                name="calendar"
                size={20}
                color="#fff"
              />
  
              <Text style={styles.saveText}>
                {variant === "followup" ? "Save Follow-up" : "Save Appointment"}
              </Text>
            </TouchableOpacity>

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

                <Calendar
                  markedDates={
                    draftDate
                      ? {
                          [draftDate]: {
                            selected: true,
                            selectedColor: "#111827",
                            selectedTextColor: "#fff",
                          },
                        }
                      : {}
                  }
                  enableSwipeMonths
                  hideExtraDays
                  firstDay={1}
                  theme={{
                    backgroundColor: "#ffffff",
                    calendarBackground: "#ffffff",
                    textSectionTitleColor: "#6b7280",
                    selectedDayBackgroundColor: "#111827",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: "#111827",
                    dayTextColor: "#111827",
                    textDisabledColor: "#cbd5e1",
                    arrowColor: "#111827",
                    monthTextColor: "#111827",
                    textMonthFontWeight: "800",
                    textDayFontWeight: "600",
                    textDayHeaderFontWeight: "800",
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
                      setAppointmentDate(draftDate);
                      setIsCalendarOpen(false);
                    }}
                  >
                    <Text style={styles.modalPrimaryText}>Use date</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </BottomSheetScrollView>
        </BottomSheet>
      );
    }
  );
  
  export default AddAppointmentSheet;
  
  const styles = StyleSheet.create({
    sheetBackground: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
  
    content: {
      padding: 20,
      paddingBottom: 100,
    },
  
    title: {
      fontSize: 30,
      fontWeight: "800",
      marginBottom: 20,
    },
  
    label: {
      marginTop: 15,
      marginBottom: 8,
      fontWeight: "700",
    },
  
    input: {
      backgroundColor: "#f3f4f6",
      padding: 15,
      borderRadius: 14,
    },

    datePickRow: {
      backgroundColor: "#f3f4f6",
      borderRadius: 14,
      paddingHorizontal: 14,
      height: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    datePickLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
      minWidth: 0,
      paddingRight: 10,
    },

    datePickText: {
      color: "#111827",
      fontWeight: "700",
    },

    inputWithIcon: {
      backgroundColor: "#f3f4f6",
      borderRadius: 14,
      paddingHorizontal: 14,
      height: 52,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    inputInline: {
      flex: 1,
      padding: 0,
    },
  
    textArea: {
      backgroundColor: "#f3f4f6",
      padding: 15,
      borderRadius: 14,
      minHeight: 120,
      textAlignVertical: "top",
    },
  
    row: {
      flexDirection: "row",
      gap: 10,
    },
  
    optionButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: "#e5e7eb",
      alignItems: "center",
    },
  
    activeButton: {
      backgroundColor: "#111827",
    },
  
    optionText: {
      fontWeight: "600",
    },
  
    activeText: {
      color: "#fff",
    },
  
    saveButton: {
      backgroundColor: "#111827",
      padding: 18,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 10,
      marginTop: 30,
    },
  
    saveText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 16,
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
      backgroundColor: "#111827",
      alignItems: "center",
      justifyContent: "center",
    },

    modalPrimaryText: {
      color: "#ffffff",
      fontWeight: "900",
    },
  });