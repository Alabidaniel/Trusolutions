import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingScreen3() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <View pointerEvents="none" style={styles.bgShapes}>
        <View style={[styles.shape, styles.shapeOne]} />
        <View style={[styles.shape, styles.shapeTwo]} />
        <View style={[styles.shape, styles.shapeThree]} />
      </View>
      <View pointerEvents="none" style={styles.bgShapesBottom}>
        <View style={[styles.bottomShape, styles.bottomShapeOne]} />
        <View style={[styles.bottomShape, styles.bottomShapeTwo]} />
        <View style={[styles.bottomShape, styles.bottomShapeThree]} />
      </View>

      <Text style={styles.title}>Build healthier patterns over time</Text>
      <Text style={styles.subtitle}>
        Daily check-ins and progress insights help you understand what supports
        your wellbeing.
      </Text>

      <View style={styles.featureCard}>
        <Feature icon="calendar-outline" text="Quick daily mood check-ins" />
        <Feature icon="analytics-outline" text="Progress dashboard and trends" />
        <Feature icon="heart-outline" text="Support recommendations that fit you" />
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.primaryText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFF9F3" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Feature({ icon, text }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIconWrap}>
        <Ionicons name={icon} size={18} color="#7A4B2F" />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6CB",
    paddingHorizontal: 20,
  },
  bgShapes: {
    position: "absolute",
    top: 18,
    right: 0,
    left: 0,
    height: 220,
  },
  shape: {
    position: "absolute",
    borderRadius: 999,
  },
  shapeOne: {
    width: 170,
    height: 170,
    backgroundColor: "rgba(122, 75, 47, 0.08)",
    right: -40,
    top: 8,
  },
  shapeTwo: {
    width: 105,
    height: 105,
    backgroundColor: "rgba(247, 235, 221, 0.65)",
    right: 110,
    top: 28,
  },
  shapeThree: {
    width: 70,
    height: 70,
    backgroundColor: "rgba(255, 248, 238, 0.85)",
    right: 70,
    top: 130,
  },
  bgShapesBottom: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: 210,
  },
  bottomShape: {
    position: "absolute",
    borderRadius: 999,
  },
  bottomShapeOne: {
    width: 180,
    height: 180,
    backgroundColor: "rgba(122, 75, 47, 0.08)",
    left: -60,
    bottom: -70,
  },
  bottomShapeTwo: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(255, 248, 238, 0.8)",
    left: 85,
    bottom: 40,
  },
  bottomShapeThree: {
    width: 70,
    height: 70,
    backgroundColor: "rgba(247, 235, 221, 0.7)",
    right: 32,
    bottom: 58,
  },
  title: {
    marginTop: 18,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#8A6A57",
    marginBottom: 18,
  },
  featureCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ECD8C1",
    padding: 16,
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F9F1E5",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
    color: "#3D2B1F",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  footer: {
    marginTop: "auto",
    gap: 16,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D7B8A0",
  },
  activeDot: {
    width: 24,
    borderRadius: 8,
    backgroundColor: "#7A4B2F",
  },
  primaryButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#3D2B1F",
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryText: {
    color: "#FFF9F3",
    fontWeight: "800",
    fontSize: 16,
  },
});
