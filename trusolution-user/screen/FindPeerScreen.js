import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function FindPeerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [style, setStyle] = useState(null);

  const goHome = React.useCallback(() => {
    navigation.navigate("MainTabs", { screen: "Home" });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== "android") {
        return undefined;
      }

      const onBackPress = () => {
        goHome();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [goHome]),
  );

  const topics = [
    "STRESS",
    "ANXIETY",
    "GRIEF",
    "DEPRESSION",
    "RELATIONSHIP",
    "CONFESSION",
    "SELF-ESTEEM",
    "FAMILY",
    "WORK",
    "TRAUMA",
    "BREAK-UPS",
    "LONLINESS",
  ];

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goHome}>
            <Ionicons name="arrow-back" size={20} color="#3D2B1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find Peer</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Ionicons name="people" size={14} color="#256D3C" />
            <Text style={styles.heroBadgeText}>Peer support</Text>
          </View>
          <Text style={styles.title}>Chat with Peer</Text>
          <Text style={styles.subtitle}>
            Connect with someone who understands what you are going through.
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>{selectedTopics.length}</Text>
              <Text style={styles.heroStatLabel}>Topics picked</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>{style || "Both"}</Text>
              <Text style={styles.heroStatLabel}>Conversation style</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Topics</Text>
            <Text style={styles.sectionHint}>Pick one or more</Text>
          </View>

          <View style={styles.grid}>
            {topics.map((topic) => {
              const isSelected = selectedTopics.includes(topic);

              return (
                <TouchableOpacity
                  key={topic}
                  style={[styles.tag, isSelected && styles.selectedTag]}
                  onPress={() => toggleTopic(topic)}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.tagText, isSelected && styles.selectedText]}>
                    {topic}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Preferred conversation style</Text>
            <Text style={styles.sectionHint}>Choose one</Text>
          </View>

          <View style={styles.row}>
            {["Listener", "Advice", "Both"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.optionBtn, style === item && styles.optionBtnActive]}
                onPress={() => setStyle(item)}
                activeOpacity={0.9}
              >
                <Text style={[styles.optionText, style === item && styles.optionTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.identity}>
            <Ionicons name="shield-checkmark" size={16} color="#14532D" />
            <Text style={styles.identityText}>Identity Mode: Open</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.findBtn, selectedTopics.length === 0 && styles.findBtnDisabled]}
          onPress={() => {
            if (selectedTopics.length > 0) {
              navigation.navigate("Searching", {
                selectedTopics,
                conversationStyle: style || "Both",
              });
            }
          }}
          disabled={selectedTopics.length === 0}
          activeOpacity={0.9}
        >
          <Text
            style={[styles.findText, selectedTopics.length === 0 && styles.findTextDisabled]}
          >
            FIND PEER
          </Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={selectedTopics.length === 0 ? "#8A6A57" : "#FFF9F3"}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

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
    paddingTop: 8,
    paddingBottom: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8EE",
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#3D2B1F",
  },
  headerSpacer: {
    width: 40,
  },
  heroCard: {
    backgroundColor: "#7A4B2F",
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#E7F4E1",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: "#256D3C",
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
    color: "#FFF9F3",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#F7E2D6",
    marginBottom: 16,
  },
  heroStatsRow: {
    flexDirection: "row",
    gap: 10,
  },
  heroStatCard: {
    flex: 1,
    backgroundColor: "#8B5A3C",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  heroStatValue: {
    color: "#FFF9F3",
    fontWeight: "800",
    fontSize: 15,
    marginBottom: 3,
  },
  heroStatLabel: {
    color: "#E7C9B7",
    fontSize: 11,
  },
  sectionCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3D2B1F",
  },
  sectionHint: {
    fontSize: 12,
    color: "#8A6A57",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#E4C9A8",
    backgroundColor: "#F9F1E5",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  selectedTag: {
    backgroundColor: "#7A4B2F",
    borderColor: "#7A4B2F",
  },
  tagText: {
    fontWeight: "700",
    color: "#6E5444",
    fontSize: 12,
  },
  selectedText: {
    color: "#FFF9F3",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 14,
  },
  optionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E4C9A8",
    backgroundColor: "#F9F1E5",
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 14,
  },
  optionBtnActive: {
    backgroundColor: "#7A4B2F",
    borderColor: "#7A4B2F",
  },
  optionText: {
    fontWeight: "700",
    color: "#6E5444",
    fontSize: 13,
  },
  optionTextActive: {
    color: "#FFF9F3",
  },
  identity: {
    backgroundColor: "#E7F4E1",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  identityText: {
    color: "#14532D",
    fontWeight: "700",
    fontSize: 12,
  },
  findBtn: {
    backgroundColor: "#7A4B2F",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  findBtnDisabled: {
    backgroundColor: "#E5D6C2",
  },
  findText: {
    color: "#FFF9F3",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  findTextDisabled: {
    color: "#8A6A57",
  },
});
