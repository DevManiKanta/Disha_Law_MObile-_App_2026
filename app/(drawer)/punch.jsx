import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function PunchScreen() {
  const insets = useSafeAreaInsets();
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const punchButtonScale = useSharedValue(1);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock location data (replace with real location when expo-location is installed)
  const getMockLocation = () => {
    return {
      latitude: 28.6139 + (Math.random() - 0.5) * 0.01,
      longitude: 77.209 + (Math.random() - 0.5) * 0.01,
      accuracy: Math.floor(Math.random() * 10) + 5,
    };
  };

  const handlePunchIn = async () => {
    setIsLoading(true);
    punchButtonScale.value = withSpring(0.95, { damping: 8 });
    setTimeout(() => {
      punchButtonScale.value = withSpring(1, { damping: 8 });
    }, 100);

    try {
      const loc = getMockLocation();

      const now = new Date();
      const punchData = {
        type: "PUNCH_IN",
        time: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        timestamp: now.toISOString(),
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy,
        date: now.toLocaleDateString(),
      };

      // Console log the punch in data
      console.log("=== PUNCH IN DATA ===");
      console.log(JSON.stringify(punchData, null, 2));
      console.log("====================");

      setPunchInTime(punchData);
      setLocation(loc);
      setIsPunchedIn(true);
    } catch (error) {
      console.error("Punch in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePunchOut = async () => {
    setIsLoading(true);
    punchButtonScale.value = withSpring(0.95, { damping: 8 });
    setTimeout(() => {
      punchButtonScale.value = withSpring(1, { damping: 8 });
    }, 100);

    try {
      const loc = getMockLocation();

      const now = new Date();
      const punchOutData = {
        type: "PUNCH_OUT",
        time: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        timestamp: now.toISOString(),
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy,
        date: now.toLocaleDateString(),
        punchInTime: punchInTime?.time,
        duration: calculateDuration(punchInTime?.timestamp, now.toISOString()),
      };

      // Console log the punch out data
      console.log("=== PUNCH OUT DATA ===");
      console.log(JSON.stringify(punchOutData, null, 2));
      console.log("=====================");

      setPunchOutTime(punchOutData);
      setIsPunchedIn(false);
    } catch (error) {
      console.error("Punch out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "N/A";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = Math.floor((end - start) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const punchButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: punchButtonScale.value }],
  }));

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
      {/* HEADER */}
      <Animated.View
        style={styles.header}
        entering={FadeInDown.duration(600)}
      >
        <Text style={styles.greeting}>Welcome Back</Text>
        <Text style={styles.title}>Employee Attendance</Text>
        <Text style={styles.date}>{formatDate(currentTime)}</Text>
      </Animated.View>

      {/* CURRENT TIME CARD */}
      <Animated.View
        style={styles.timeCard}
        entering={FadeInUp.duration(600).delay(100)}
      >
        <LinearGradient
          colors={["#3b82f6", "#2563eb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.timeGradient}
        >
          <Text style={styles.timeLabel}>Current Time</Text>
          <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeSubtitle}>Live Clock</Text>
        </LinearGradient>
      </Animated.View>

      {/* PUNCH IN/OUT SECTION */}
      <Animated.View
        style={styles.punchSection}
        entering={FadeInUp.duration(600).delay(200)}
      >
        <Text style={styles.sectionTitle}>Attendance Status</Text>

        {/* STATUS BADGE */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isPunchedIn ? "#ecfdf5" : "#fef2f2",
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isPunchedIn ? "#10b981" : "#ef4444",
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: isPunchedIn ? "#10b981" : "#ef4444",
              },
            ]}
          >
            {isPunchedIn ? "Punched In" : "Punched Out"}
          </Text>
        </View>

        {/* PUNCH BUTTONS SIDE BY SIDE */}
        <View style={styles.punchButtonsRow}>
          <Animated.View
            style={[styles.punchButtonWrapper, punchButtonAnimatedStyle]}
          >
            <TouchableOpacity
              style={[styles.punchButton, styles.punchInButton]}
              onPress={handlePunchIn}
              disabled={isPunchedIn || isLoading}
              activeOpacity={0.85}
            >
              <Ionicons name="log-in-outline" size={32} color="#fff" />
              <Text style={styles.punchButtonText}>Punch In</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[styles.punchButtonWrapper, punchButtonAnimatedStyle]}
          >
            <TouchableOpacity
              style={[styles.punchButton, styles.punchOutButton]}
              onPress={handlePunchOut}
              disabled={!isPunchedIn || isLoading}
              activeOpacity={0.85}
            >
              <Ionicons name="log-out-outline" size={32} color="#fff" />
              <Text style={styles.punchButtonText}>Punch Out</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* PUNCH DETAILS */}
        {punchInTime && (
          <Animated.View
            style={styles.detailsCard}
            entering={FadeInUp.duration(600).delay(300)}
          >
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="log-in-outline" size={20} color="#10b981" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Punch In Time</Text>
                <Text style={styles.detailValue}>{punchInTime.time}</Text>
              </View>
            </View>

            {punchOutTime && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Punch Out Time</Text>
                    <Text style={styles.detailValue}>{punchOutTime.time}</Text>
                  </View>
                </View>

                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="time-outline" size={20} color="#8b5cf6" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Total Duration</Text>
                    <Text style={styles.detailValue}>{punchOutTime.duration}</Text>
                  </View>
                </View>
              </>
            )}
          </Animated.View>
        )}
      </Animated.View>

      {/* INFO CARD */}
      <Animated.View
        style={styles.infoCard}
        entering={FadeInUp.duration(600).delay(400)}
      >
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
          <Text style={styles.infoText}>
            Time and location are recorded for attendance tracking
          </Text>
        </View>
      </Animated.View>
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

  header: {
    marginBottom: 24,
  },

  greeting: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 4,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
    marginBottom: 8,
  },

  date: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },

  timeCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 28,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },

  timeGradient: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  timeLabel: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    marginBottom: 8,
  },

  currentTime: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
    marginBottom: 8,
  },

  timeSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },

  punchSection: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 16,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 14,
    fontWeight: "800",
  },

  punchButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  punchButtonWrapper: {
    flex: 1,
  },

  punchButton: {
    paddingVertical: 24,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  punchInButton: {
    backgroundColor: "#10b981",
  },

  punchOutButton: {
    backgroundColor: "#ef4444",
  },

  punchButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },

  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "800",
  },

  detailSub: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
  },

  infoCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    padding: 14,
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  infoText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "600",
    flex: 1,
  },
});
