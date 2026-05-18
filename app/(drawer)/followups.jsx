import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";

// Sample follow-up data - in real app, this would come from global state or database
const SAMPLE_FOLLOWUPS = [
  {
    id: "1",
    clientName: "John Doe",
    clientId: "1",
    message: "Client interested in corporate restructuring. Follow up next week.",
    timestamp: "Today at 2:30 PM",
    date: new Date(),
  },
  {
    id: "2",
    clientName: "Sarah Smith",
    clientId: "2",
    message: "Waiting for client to provide additional documents for case review.",
    timestamp: "Yesterday at 4:15 PM",
    date: new Date(Date.now() - 86400000),
  },
  {
    id: "3",
    clientName: "Michael Brown",
    clientId: "3",
    message: "Initial consultation completed. Sent proposal for review.",
    timestamp: "2 days ago at 10:00 AM",
    date: new Date(Date.now() - 172800000),
  },
];

export default function FollowupsScreen() {
  const insets = useSafeAreaInsets();
  const [followups, setFollowups] = useState(SAMPLE_FOLLOWUPS);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const FILTERS = ["All", "Today", "This Week", "Pending"];

  const filteredFollowups = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return followups.filter((item) => {
      if (selectedFilter === "All") return true;
      if (selectedFilter === "Today") {
        const itemDate = new Date(
          item.date.getFullYear(),
          item.date.getMonth(),
          item.date.getDate()
        );
        return itemDate.getTime() === today.getTime();
      }
      if (selectedFilter === "This Week") {
        return item.date >= weekAgo;
      }
      if (selectedFilter === "Pending") {
        return item.date >= weekAgo;
      }
      return true;
    });
  }, [followups, selectedFilter]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top + 12, 12) },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          layout={Layout.springify()}
          style={styles.header}
        >
          <Text style={styles.title}>Follow-ups</Text>
          <Text style={styles.subtitle}>
            {filteredFollowups.length} follow-up{filteredFollowups.length === 1 ? "" : "s"}
          </Text>
        </Animated.View>

        {/* FILTERS */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(100)}
          layout={Layout.springify()}
          style={styles.filterContainer}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* FOLLOWUPS LIST */}
        {filteredFollowups.length > 0 ? (
          <FlatList
            data={filteredFollowups}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInUp.duration(600).delay(index * 100)}
                layout={Layout.springify()}
                style={styles.followupCard}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.clientInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {item.clientName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.clientDetails}>
                      <Text style={styles.clientName}>{item.clientName}</Text>
                      <Text style={styles.timestamp}>{item.timestamp}</Text>
                    </View>
                  </View>
                  <View style={styles.statusBadge}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
                  </View>
                </View>

                <View style={styles.messageContainer}>
                  <Text style={styles.message}>{item.message}</Text>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <Ionicons name="call-outline" size={16} color="#3b82f6" />
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <Ionicons name="chatbubble-outline" size={16} color="#3b82f6" />
                    <Text style={styles.actionText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <Ionicons name="calendar-outline" size={16} color="#3b82f6" />
                    <Text style={styles.actionText}>Schedule</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Animated.View
            entering={FadeInUp.duration(600)}
            style={styles.emptyState}
          >
            <View style={styles.emptyIcon}>
              <Ionicons name="chatbubbles-outline" size={48} color="#cbd5e1" />
            </View>
            <Text style={styles.emptyTitle}>No Follow-ups</Text>
            <Text style={styles.emptySubtitle}>
              No follow-ups found for the selected filter
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  header: {
    marginBottom: 20,
    marginTop: 8,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    marginTop: 6,
  },

  filterContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  filterButtonActive: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
  },

  filterTextActive: {
    color: "#fff",
  },

  listContent: {
    gap: 12,
  },

  followupCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  avatarText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#3b82f6",
  },

  clientDetails: {
    flex: 1,
  },

  clientName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
  },

  timestamp: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
    marginTop: 2,
  },

  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#ecfdf5",
    justifyContent: "center",
    alignItems: "center",
  },

  messageContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  message: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
    lineHeight: 18,
  },

  cardFooter: {
    flexDirection: "row",
    gap: 8,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  actionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3b82f6",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
