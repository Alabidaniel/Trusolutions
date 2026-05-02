import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const issues = [
  "Stress",
  "Anxiety",
  "Grief",
  "Depression",
  "Relationship",
  "Confession",
  "Self-esteem",
  "Family",
  "Work",
  "Trauma",
  "Break-up",
  "Loneliness",
];

const SelectIssuesScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedIssues, setSelectedIssues] = useState([]);

  const toggleIssue = (issue) => {
    const newSelected = selectedIssues.includes(issue)
      ? selectedIssues.filter((i) => i !== issue)
      : [...selectedIssues, issue];
    setSelectedIssues(newSelected);
  };

  const handleContinue = () => {
    navigation.navigate("ProfileMode");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <ScrollView
        style={styles.scroll}
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
          <Text style={styles.title}>Select your concerns</Text>
          <Text style={styles.subtitle}>
            Choose what you are facing so we can personalize your support journey.
          </Text>
        </View>

        <View style={styles.grid}>
          {issues.map((issue) => {
            const isSelected = selectedIssues.includes(issue);
            return (
              <TouchableOpacity
                key={issue}
                style={[styles.issueChip, isSelected && styles.issueChipSelected]}
                onPress={() => toggleIssue(issue)}
              >
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={14} color="#FFF9F3" />
                ) : null}
                <Text style={[styles.issueText, isSelected && styles.issueTextSelected]}>
                  {issue}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
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
  scroll: {
    flex: 1,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  issueChip: {
    backgroundColor: "#F9F1E5",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E4C9A8",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  issueChipSelected: {
    backgroundColor: "#7A4B2F",
    borderColor: "#7A4B2F",
  },
  issueText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6E5444",
  },
  issueTextSelected: {
    color: "#FFF9F3",
  },
  button: {
    backgroundColor: "#3D2B1F",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 4,
  },
  buttonText: {
    color: "#FFF9F3",
    fontSize: 15,
    fontWeight: "800",
  },
});

export default SelectIssuesScreen;
