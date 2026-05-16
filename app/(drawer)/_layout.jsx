// import { Drawer } from "expo-router/drawer";
// import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { StyleSheet, Text, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// function CustomDrawerContent(props) {
//   const insets = useSafeAreaInsets();
//   return (
//     <DrawerContentScrollView
//       {...props}
//       contentContainerStyle={styles.drawerContent}
//       showsVerticalScrollIndicator={false}
//     >
//       <LinearGradient
//         colors={["#0f172a", "#111827"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={[styles.brandHeader, { paddingTop: Math.max(insets.top, 12) + 16 }]}
//       >
//         <View style={styles.logoCircle}>
//           <Ionicons name="briefcase-outline" size={22} color="#0f172a" />
//         </View>

//         <View style={styles.brandText}>
//           <Text style={styles.appName}>FirstApp</Text>
//           <Text style={styles.tagline}>Clients • Calls • Appointments</Text>
//         </View>
//       </LinearGradient>

//       <View style={styles.drawerList}>
//         <DrawerItemList {...props} />
//       </View>

//       <View style={styles.drawerFooter}>
//         <Text style={styles.footerText}>Built with Expo</Text>
//       </View>
//     </DrawerContentScrollView>
//   );
// }

// export default function DrawerLayout() {
//   return (
//     <Drawer
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         headerShown: true,
//         headerTitleAlign: "left",
//         headerStyle: { backgroundColor: "#f8fafc" },
//         headerTitleStyle: {
//           fontWeight: "900",
//           color: "#0f172a",
//         },
//         headerTintColor: "#0f172a",
//         sceneContainerStyle: { backgroundColor: "#f8fafc" },

//         drawerType: "front",
//         drawerStyle: {
//           backgroundColor: "#ffffff",
//           width: 300,
//         },
//         drawerActiveTintColor: "#0f172a",
//         drawerInactiveTintColor: "#475569",
//         drawerLabelStyle: {
//           fontWeight: "800",
//           fontSize: 14,
//         },
//         drawerItemStyle: {
//           borderRadius: 14,
//           marginHorizontal: 12,
//           marginVertical: 4,
//         },
//       }}
//     >
//       <Drawer.Screen
//         name="(tabs)"
//         options={{
//           title: "Home",
//           drawerLabel: "Home",
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="home-outline" color={color} size={size} />
//           ),
//         }}
//       />

//       <Drawer.Screen
//         name="clients"
//         options={{
//           title: "Clients",
//           drawerLabel: "Clients",
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="people-outline" color={color} size={size} />
//           ),
//         }}
//       />

//       <Drawer.Screen
//         name="appointments"
//         options={{
//           title: "Appointments",
//           drawerLabel: "Appointments",
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="calendar-outline" color={color} size={size} />
//           ),
//         }}
//       />

//       <Drawer.Screen
//         name="contact"
//         options={{
//           title: "Contact",
//           drawerLabel: "Contact",
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="mail-outline" color={color} size={size} />
//           ),
//         }}
//       />
//     </Drawer>
//   );
// }

// const styles = StyleSheet.create({
//   drawerContent: {
//     paddingTop: 0,
//   },

//   brandHeader: {
//     paddingTop: 24,
//     paddingBottom: 16,
//     paddingHorizontal: 16,
//     borderBottomLeftRadius: 22,
//     borderBottomRightRadius: 22,
//     marginBottom: 10,
//   },

//   logoCircle: {
//     height: 44,
//     width: 44,
//     borderRadius: 16,
//     backgroundColor: "#ffffff",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.15)",
//   },

//   brandText: {
//     marginTop: 12,
//   },

//   appName: {
//     color: "#ffffff",
//     fontWeight: "900",
//     fontSize: 18,
//     letterSpacing: 0.2,
//   },

//   tagline: {
//     color: "rgba(255,255,255,0.75)",
//     marginTop: 4,
//     fontWeight: "600",
//   },

//   drawerList: {
//     paddingTop: 6,
//   },

//   drawerFooter: {
//     paddingHorizontal: 16,
//     paddingTop: 10,
//     paddingBottom: 14,
//   },

//   footerText: {
//     color: "#94a3b8",
//     fontWeight: "700",
//     fontSize: 12,
//   },
// });



import { Drawer } from "expo-router/drawer";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import { Ionicons } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function CustomDrawerContent(props) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={["top"]}
      style={styles.safeArea}
    >
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={[
          styles.drawerContent,
          { paddingBottom: Math.max(insets.bottom, 14) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <LinearGradient
          colors={["#0f172a", "#111827"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.brandHeader,
            {
              paddingTop: insets.top + 20,
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Ionicons
              name="briefcase-outline"
              size={22}
              color="#0f172a"
            />
          </View>

          <View style={styles.brandText}>
            <Text style={styles.appName}>
              FirstApp
            </Text>

            <Text style={styles.tagline}>
              Clients • Calls • Appointments
            </Text>
          </View>
        </LinearGradient>

        {/* DRAWER ITEMS */}
        <View style={styles.drawerList}>
          <Text style={styles.sectionLabel}>Menu</Text>
          <DrawerItemList {...props} />
        </View>

        {/* FOOTER */}
        <View style={styles.drawerFooter}>
          <View style={styles.footerRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#94a3b8" />
            <Text style={styles.footerText}>Secure local CRM</Text>
          </View>
          <Text style={styles.footerSub}>Built with Expo • v1.0</Text>
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: true,

        headerTitleAlign: "left",

        headerStyle: {
          backgroundColor: "#f8fafc",
        },

        headerTitleStyle: {
          fontWeight: "900",
          color: "#0f172a",
        },

        headerTintColor: "#0f172a",

        sceneContainerStyle: {
          backgroundColor: "#f8fafc",
        },

        drawerType: "front",

        drawerStyle: {
          backgroundColor: "#ffffff",
          width: 300,
        },

        drawerActiveTintColor: "#0f172a",

        drawerInactiveTintColor: "#475569",

        drawerActiveBackgroundColor: "#eef2ff",

        drawerLabelStyle: {
          fontWeight: "800",
          fontSize: 14,
        },

        drawerItemStyle: {
          borderRadius: 14,
          marginHorizontal: 12,
          marginVertical: 4,
        },
      }}
    >
      {/* HOME */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Home",

          drawerLabel: "Home",

          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* CLIENTS */}
      <Drawer.Screen
        name="clients"
        options={{
          title: "Clients",

          drawerLabel: "Clients",

          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="people-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* APPOINTMENTS */}
      <Drawer.Screen
        name="appointments"
        options={{
          title: "Appointments",

          drawerLabel: "Appointments",

          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="calendar-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* CONTACT */}
      <Drawer.Screen
        name="contact"
        options={{
          title: "Contact",

          drawerLabel: "Contact",

          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="mail-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  drawerContent: {
    flexGrow: 1,
    paddingTop: 0,
  },

  brandHeader: {
    marginTop: 10,

    paddingBottom: 18,
    paddingHorizontal: 18,

    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,

    marginHorizontal: 10,
    marginBottom: 12,

    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 6,
  },

  logoCircle: {
    height: 50,
    width: 50,
    borderRadius: 18,

    backgroundColor: "#ffffff",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  brandText: {
    marginTop: 14,
  },

  appName: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 20,
    letterSpacing: 0.3,
  },

  tagline: {
    color: "rgba(255,255,255,0.75)",
    marginTop: 5,
    fontWeight: "600",
    fontSize: 13,
  },

  drawerList: {
    paddingTop: 10,
  },

  sectionLabel: {
    marginLeft: 18,
    marginBottom: 6,
    color: "#94a3b8",
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  drawerFooter: {
    marginTop: "auto",

    paddingHorizontal: 18,
    paddingBottom: 24,
    paddingTop: 14,
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  footerText: {
    color: "#94a3b8",
    fontWeight: "900",
    fontSize: 12.5,
  },

  footerSub: {
    marginTop: 6,
    color: "#cbd5e1",
    fontWeight: "700",
    fontSize: 11.5,
  },
});