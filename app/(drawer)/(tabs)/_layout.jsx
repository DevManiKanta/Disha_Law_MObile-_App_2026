import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import AddClientSheet from "../../components/AddClientSheet";
import AddAppointmentSheet from "../../components/AddAppointmentSheet";

export default function TabLayout() {
  const sheetRef = useRef(null);
  const appointmentSheetRef = useRef(null);
  const [appointmentPrefill, setAppointmentPrefill] = useState(null);
  const fabScale = useSharedValue(1);

  const openSheet = () => {
    fabScale.value = withSpring(0.95, { damping: 8 });
    setTimeout(() => {
      fabScale.value = withSpring(1, { damping: 8 });
    }, 100);
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

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "#3b82f6",
          tabBarInactiveTintColor: "#94a3b8",
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
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

        {/* CENTER BUTTON - FAB */}
        <Tabs.Screen
          name="add-client"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              openSheet();
            },
            focus: () => {
              openSheet();
              requestAnimationFrame(() => router.replace("/(drawer)/(tabs)"));
            },
          }}
          options={{
            title: "",
            tabBarButton: () => (
              <Animated.View style={[styles.fabContainer, fabAnimatedStyle]}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={openSheet}
                  style={styles.fabTouchable}
                >
                  <LinearGradient
                    colors={["#3b82f6", "#2563eb"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fabGradient}
                  >
                    <Ionicons name="add" size={32} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ),
          }}
        />

        {/* APPOINTMENTS */}
        <Tabs.Screen
          name="appointments"
          listeners={{
            tabPress: (e) => {
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

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    elevation: 8,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },

  tabBarLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },

  tabBarIcon: {
    marginBottom: 4,
  },

  fabContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  fabTouchable: {
    borderRadius: 40,
    overflow: "hidden",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },

  fabGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});
