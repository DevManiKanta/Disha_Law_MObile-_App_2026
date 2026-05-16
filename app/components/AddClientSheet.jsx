import { forwardRef, useCallback, useMemo, useState } from "react";

import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

const AddClientSheet = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ["90%"], []);

  const [callType, setCallType] = useState("Incoming");
  const [leadType, setLeadType] = useState("Warm");
  const [focusedField, setFocusedField] = useState(null);
  const [reference, setReference] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const SheetTextInput = Platform.OS === "web" ? TextInput : BottomSheetTextInput;

  const handleFocus = useCallback((fieldName) => {
    setFocusedField(fieldName);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      handleStyle={styles.handle}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add New Client</Text>
          <Text style={styles.subtitle}>Fill in the details below</Text>
          <View style={styles.headerDivider} />
        </View>

        {/* CALL TYPE */}
        <View style={styles.section}>
          <Text style={styles.label}>Call Type</Text>

          <View style={styles.row}>
            {["Incoming", "Outgoing"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.optionButton,
                  callType === item && styles.activeButton,
                ]}
                onPress={() => setCallType(item)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={item === "Incoming" ? "arrow-down" : "arrow-up"}
                  size={16}
                  color={callType === item ? "#fff" : "#6b7280"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    styles.optionText,
                    callType === item && styles.activeText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* LEAD TYPE */}
        <View style={styles.section}>
          <Text style={styles.label}>Lead Type</Text>

          <View style={styles.row}>
            {["Cold", "Warm", "Hot"].map((item) => {
              const isSelected = leadType === item;
              let buttonStyle = [styles.optionButton];
              if (isSelected) {
                if (item === "Cold") buttonStyle.push(styles.activeButtonCold);
                else if (item === "Warm")
                  buttonStyle.push(styles.activeButtonWarm);
                else if (item === "Hot")
                  buttonStyle.push(styles.activeButtonHot);
              }
              return (
                <TouchableOpacity
                  key={item}
                  style={buttonStyle}
                  onPress={() => setLeadType(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      item === "Cold"
                        ? "snowflake"
                        : item === "Warm"
                          ? "sunny"
                          : "flame"
                    }
                    size={16}
                    color={isSelected ? "#fff" : "#6b7280"}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={[styles.optionText, isSelected && styles.activeText]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* FULL NAME */}
        <View style={styles.section}>
          <Text style={styles.label}>Full Name</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "name" && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="person"
              size={18}
              color={focusedField === "name" ? "#3b82f6" : "#9ca3af"}
              style={styles.inputIcon}
            />
            <SheetTextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Rahul Sharma"
              placeholderTextColor="#d1d5db"
              style={styles.input}
              cursorColor="#3b82f6"
              selectionColor="#bfdbfe"
              caretHidden={false}
              editable={true}
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* PHONE */}
        <View style={styles.section}>
          <Text style={styles.label}>Phone</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "phone" && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="call"
              size={18}
              color={focusedField === "phone" ? "#3b82f6" : "#9ca3af"}
              style={styles.inputIcon}
            />
            <SheetTextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98765 43210"
              placeholderTextColor="#d1d5db"
              keyboardType="phone-pad"
              style={styles.input}
              cursorColor="#3b82f6"
              selectionColor="#bfdbfe"
              caretHidden={false}
              editable={true}
              onFocus={() => handleFocus("phone")}
              onBlur={handleBlur}
            />
          </View>
        </View>

        {/* LOCATION */}
        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "location" && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="location"
              size={18}
              color={focusedField === "location" ? "#3b82f6" : "#9ca3af"}
              style={styles.inputIcon}
            />
            <SheetTextInput
              placeholder="Mumbai, MH"
              placeholderTextColor="#d1d5db"
              style={styles.input}
              cursorColor="#3b82f6"
              selectionColor="#bfdbfe"
              caretHidden={false}
              editable={true}
              onFocus={() => handleFocus("location")}
              onBlur={handleBlur}
            />
          </View>
        </View>

        {/* REFERENCE */}
        <View style={styles.section}>
          <Text style={styles.label}>Reference</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "reference" && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="people"
              size={18}
              color={focusedField === "reference" ? "#3b82f6" : "#9ca3af"}
              style={styles.inputIcon}
            />
            <SheetTextInput
              placeholder="Referred by / Source"
              placeholderTextColor="#d1d5db"
              style={styles.input}
              cursorColor="#3b82f6"
              selectionColor="#bfdbfe"
              value={reference}
              onChangeText={setReference}
              onFocus={() => handleFocus("reference")}
              onBlur={handleBlur}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* CASE TYPE */}
        <View style={styles.section}>
          <Text style={styles.label}>Case Type</Text>
          <View
            style={[
              styles.inputContainer,
              focusedField === "caseType" && styles.inputContainerFocused,
            ]}
          >
            <Ionicons
              name="briefcase"
              size={18}
              color={focusedField === "caseType" ? "#3b82f6" : "#9ca3af"}
              style={styles.inputIcon}
            />
            <SheetTextInput
              placeholder="Select case type"
              placeholderTextColor="#d1d5db"
              style={styles.input}
              cursorColor="#3b82f6"
              selectionColor="#bfdbfe"
              caretHidden={false}
              editable={true}
              onFocus={() => handleFocus("caseType")}
              onBlur={handleBlur}
            />
          </View>
        </View>

        {/* REMARKS */}
        <View style={styles.section}>
          <Text style={styles.label}>Remarks</Text>
          <View
            style={[
              styles.textAreaContainer,
              focusedField === "remarks" && styles.textAreaContainerFocused,
            ]}
          >
            <SheetTextInput
              multiline
              numberOfLines={4}
              placeholder="Add any additional notes..."
              placeholderTextColor="#d1d5db"
              style={styles.textArea}
              cursorColor="#3b82f6"
              selectionColor="#bfdbfe"
              caretHidden={false}
              editable={true}
              onFocus={() => handleFocus("remarks")}
              onBlur={handleBlur}
            />
          </View>
        </View>

        {/* SAVE */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.9}
            onPress={() => {
              props?.onCreateAppointment?.({ name: fullName, phone });
            }}
          >
            <Ionicons name="calendar-outline" size={18} color="#0f172a" style={{ marginRight: 8 }} />
            <Text style={styles.secondaryText}>Create Appointment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} activeOpacity={0.9}>
            <Ionicons
              name="checkmark-done"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.saveText}>Save Client</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default AddClientSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  handle: {
    paddingTop: 10,
  },

  handleIndicator: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },

  header: {
    marginBottom: 26,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },

  headerDivider: {
    marginTop: 18,
    height: 1,
    backgroundColor: "#f1f5f9",
  },

  section: {
    marginBottom: 22,
  },

  label: {
    marginBottom: 12,
    fontWeight: "700",
    fontSize: 13,
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    height: 56,
  },

  inputContainerFocused: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    color: "#0f172a",
    fontSize: 15.5,
    fontWeight: "600",
    padding: 0,
  },

  textAreaContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 140,
  },

  textAreaContainerFocused: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
  },

  textArea: {
    color: "#0f172a",
    fontSize: 15.5,
    fontWeight: "600",
    textAlignVertical: "top",
    padding: 0,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#f8fafc",
  },

  activeButton: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },

  activeButtonCold: {
    backgroundColor: "#06b6d4",
    borderColor: "#06b6d4",
  },

  activeButtonWarm: {
    backgroundColor: "#f59e0b",
    borderColor: "#f59e0b",
  },

  activeButtonHot: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },

  optionText: {
    fontWeight: "700",
    fontSize: 14,
    color: "#64748b",
  },

  activeText: {
    color: "#fff",
  },

  saveButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  saveText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.3,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 26,
  },

  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryText: {
    color: "#0f172a",
    fontWeight: "900",
    fontSize: 14,
  },
});
