import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const modes = [
  {
    id: "ghost",
    title: "Ghost Mode",
    subtitle: "Anonymous, no profile picture, username hidden.",
    icon: "moon-outline",
  },
  {
    id: "masked",
    title: "Masked Mode",
    subtitle: "Nickname and avatar only for partial privacy.",
    icon: "shield-outline",
  },
  {
    id: "open",
    title: "Open Mode",
    subtitle: "Full profile identity in conversations.",
    icon: "person-circle-outline",
  },
];

const ProfileModeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedMode, setSelectedMode] = useState("");

  const handleContinue = () => {
    if (!selectedMode) {
      return;
    }

    if (selectedMode === "ghost") {
      navigation.navigate("GhostMode");
    } else if (selectedMode === "masked") {
      navigation.navigate("MaskedMode");
    } else {
      navigation.navigate("OpenMode");
    }
  };

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
          <Text style={styles.title}>Choose your profile mode</Text>
          <Text style={styles.subtitle}>
            Select how your identity appears in peer and community spaces.
          </Text>
        </View>

        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          return (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeCard, isSelected && styles.modeCardSelected]}
              onPress={() => setSelectedMode(mode.id)}
            >
              <View style={[styles.modeIconWrap, isSelected && styles.modeIconWrapSelected]}>
                <Ionicons
                  name={mode.icon}
                  size={22}
                  color={isSelected ? "#FFF9F3" : "#7A4B2F"}
                />
              </View>
              <View style={styles.modeTextWrap}>
                <Text style={[styles.modeTitle, isSelected && styles.modeTitleSelected]}>{mode.title}</Text>
                <Text style={[styles.modeSubtitle, isSelected && styles.modeSubtitleSelected]}>{mode.subtitle}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.button, !selectedMode && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedMode}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
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
    padding: 16,
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
    lineHeight: 21,
    color: "#8A6A57",
  },
  modeCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ECD8C1",
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modeCardSelected: {
    backgroundColor: "#7A4B2F",
    borderColor: "#7A4B2F",
  },
  modeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9F1E5",
    alignItems: "center",
    justifyContent: "center",
  },
  modeIconWrapSelected: {
    backgroundColor: "rgba(255, 249, 243, 0.2)",
  },
  modeTextWrap: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 2,
  },
  modeTitleSelected: {
    color: "#FFF9F3",
  },
  modeSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: "#8A6A57",
  },
  modeSubtitleSelected: {
    color: "#F7E2D6",
  },
  button: {
    backgroundColor: "#3D2B1F",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: "#B8A583",
  },
  buttonText: {
    color: "#FFF9F3",
    fontSize: 15,
    fontWeight: "800",
  },
});

export default ProfileModeScreen;
