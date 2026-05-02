import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WelcomeAboardScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    navigation.replace("MainTabs");
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark" size={34} color="#256D3C" />
        </View>
        <Text style={styles.title}>Welcome Aboard</Text>
        <Text style={styles.subtitle}>
          Your preferences are set and your support space is ready.
        </Text>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6CB",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFF8EE",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ECD8C1",
    padding: 24,
    alignItems: "center",
  },
  iconWrap: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#E7F4E1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#8A6A57",
    textAlign: "center",
    marginBottom: 18,
  },
  continueButton: {
    width: "100%",
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

export default WelcomeAboardScreen;
