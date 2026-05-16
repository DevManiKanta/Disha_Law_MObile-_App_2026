import { router, Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { TouchableOpacity, View } from "react-native";

import { useRef, useState } from "react";
import AddClientSheet from "../../components/AddClientSheet";
import AddAppointmentSheet from "../../components/AddAppointmentSheet";

// import AddClientSheet from "../../../components/AddClientSheet";

export default function TabLayout() {
  const sheetRef = useRef(null);
  const appointmentSheetRef = useRef(null);
  const [appointmentPrefill, setAppointmentPrefill] = useState(null);

  const openSheet = () => {
    sheetRef.current?.expand();
  };

  const openAppointmentSheet = () => {
    appointmentSheetRef.current?.expand();
  };

  const openAppointmentFromClient = ({ name, phone }) => {
    setAppointmentPrefill({ mode: "New", name: name || "", phone: phone || "" });
    sheetRef.current?.close?.();
    requestAnimationFrame(() => openAppointmentSheet());
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarStyle: {
            height: 80,
            paddingBottom: 10,
          },
        }}
      >
        {/* HOME */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />

        {/* CENTER BUTTON */}
        <Tabs.Screen
          name="add-client"
          listeners={{
            tabPress: (e) => {
              // Open the bottom sheet instead of navigating.
              e.preventDefault();
              openSheet();
            },
            focus: () => {
              // If some navigation lands here (e.g. quick action), open and bounce back.
              openSheet();
              requestAnimationFrame(() => router.replace("/(drawer)/(tabs)"));
            },
          }}
          options={{
            title: "",

            tabBarButton: () => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={openSheet}
                style={{
                  top: -25,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: "#111827",

                    justifyContent: "center",
                    alignItems: "center",

                    elevation: 10,
                  }}
                >
                  <Ionicons name="add" size={38} color="#fff" />
                </View>
              </TouchableOpacity>
            ),
          }}
        />

        {/* APPOINTMENTS */}
        <Tabs.Screen
          name="appointments"
          listeners={{
            tabPress: (e) => {
              // Open the bottom sheet instead of navigating.
              e.preventDefault();
              openAppointmentSheet();
            },
          }}
          options={{
            title: "Appointments",

            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" color={color} size={size} />
            ),
          }}
        />
      </Tabs>

      <AddClientSheet ref={sheetRef} onCreateAppointment={openAppointmentFromClient} />
      <AddAppointmentSheet ref={appointmentSheetRef} prefill={appointmentPrefill} />
    </>
  );
}
