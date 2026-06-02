import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const features = [
  "No profile picture shown",
  "Username stays hidden",
  "Fully anonymous posting",
];

const GhostModeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 10,
            paddingTop: 8,
            justifyContent: "center",
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.iconWrap}>
            <Ionicons name="moon-outline" size={32} color="#7A4B2F" />
          </View>
          <Text style={styles.title}>Ghost Mode</Text>
          <Text style={styles.subtitle}>Maximum privacy with full anonymity.</Text>

          <View style={styles.featureList}>
            {features.map((feature) => (
              <View key={feature} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#256D3C" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate("SharingMode")}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6CB",
  },
  content: {
    paddingHorizontal: 18,
    flexGrow: 1,
  },
  heroCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ECD8C1",
    padding: 18,
    marginBottom: 16,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F9F1E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#8A6A57",
    lineHeight: 21,
    marginBottom: 14,
  },
  featureList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#3D2B1F",
    fontWeight: "600",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  backButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E4C9A8",
    backgroundColor: "#F9F1E5",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
  },
  backText: {
    color: "#7A4B2F",
    fontSize: 15,
    fontWeight: "800",
  },
  continueButton: {
    flex: 1,
    backgroundColor: "#3D2B1F",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
  },
  continueText: {
    color: "#FFF9F3",
    fontSize: 15,
    fontWeight: "800",
  },
});

export default GhostModeScreen;
