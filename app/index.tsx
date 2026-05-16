import { Dimensions, StatusBar, StyleSheet, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, {
        duration: 7000,
        easing: Easing.linear,
      }),
      -1,
    );

    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotate.value}deg`,
        },
      ],
    };
  });

  return (
    <>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#0b1220", "#0f172a", "#111827"]}
        style={styles.container}
      >
        {/* BACKGROUND CIRCLE */}
        <Animated.View style={[styles.circle, animatedStyle]} />

        {/* LOGO ICON */}
        <Animated.View
          entering={FadeInDown.duration(1000)}
          style={styles.logoContainer}
        >
          <LinearGradient
            colors={["#ffffff", "#e2e8f0"]}
            style={styles.logoGradient}
          >
            <Ionicons name="scale-outline" size={56} color="#0f172a" />
          </LinearGradient>
        </Animated.View>

        {/* APP NAME */}
        <Animated.Text entering={FadeInUp.duration(1200)} style={styles.title}>
          DISHA
        </Animated.Text>

        {/* SUBTITLE */}
        <Animated.Text
          entering={FadeInUp.delay(300).duration(1200)}
          style={styles.subtitle}
        >
          LAW FIRM
        </Animated.Text>

        {/* LOADER */}
        <Animated.View
          entering={FadeIn.delay(700).duration(1500)}
          style={styles.loaderContainer}
        >
          <View style={styles.loader}>
            <Animated.View style={styles.loaderDot} />
            <Animated.View style={styles.loaderDot} />
            <Animated.View style={styles.loaderDot} />
          </View>
        </Animated.View>

        {/* FOOTER */}
        <Animated.Text
          entering={FadeIn.delay(1000).duration(1200)}
          style={styles.footer}
        >
          Clients • Calls • Appointments
        </Animated.Text>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  circle: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.08)",
  },

  logoContainer: {
    marginBottom: 30,
  },

  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,

    elevation: 20,
  },

  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 2,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 6,
    fontWeight: "700",
  },

  loaderContainer: {
    marginTop: 50,
  },

  loader: {
    flexDirection: "row",
    alignItems: "center",
  },

  loaderDot: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginHorizontal: 6,
  },

  footer: {
    position: "absolute",
    bottom: 60,
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    letterSpacing: 1,
  },
});
