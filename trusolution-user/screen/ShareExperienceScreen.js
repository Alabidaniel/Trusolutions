import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useCommunity } from "../context/CommunityContext";

const topics = [
  "Anxiety",
  "Depression",
  "Stress",
  "Relationships",
  "Work",
  "Family",
  "Self-care",
  "Motivation",
  "Gratitude",
  "Other",
];

export default function ShareExperienceScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { addPost } = useCommunity();
  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isFormFilled = title.trim() && experience.trim();

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic].slice(0, 3),
    );
  };

  const handlePost = async () => {
    setIsLoading(true);
    try {
      await addPost({
        title,
        experience,
        topics: selectedTopics.length ? selectedTopics : ["Other"],
        isAnonymous,
      });

      Alert.alert("Posted", "Your experience has been added to the community feed.", [
        {
          text: "View Feed",
          onPress: () => {
            setTitle("");
            setExperience("");
            setSelectedTopics([]);
            navigation.navigate("MainTabs", { screen: "Interact" });
          },
        },
      ]);
    } catch (err) {
      Alert.alert("Post failed", err?.message || "Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTopic = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.topicTag,
        selectedTopics.includes(item) && styles.selectedTopic,
      ]}
      onPress={() => toggleTopic(item)}
    >
      <Text
        style={[
          styles.topicText,
          selectedTopics.includes(item) && styles.selectedTopicText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 36 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
          </TouchableOpacity>
          <Text style={styles.title}>Share Your Experience</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.subtitle}>
          Share something real. It will appear in the local community feed for
          your account.
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor="#8B7355"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />

          <TextInput
            style={styles.textarea}
            placeholder="Share your experience..."
            placeholderTextColor="#8B7355"
            value={experience}
            onChangeText={setExperience}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Topics (max 3)</Text>
            <Text style={styles.sectionSubtitle}>
              {selectedTopics.length
                ? selectedTopics.join(", ")
                : "Select up to three topics"}
            </Text>
            <FlatList
              data={topics}
              renderItem={renderTopic}
              keyExtractor={(item) => item}
              numColumns={3}
              columnWrapperStyle={styles.topicRow}
              scrollEnabled={false}
            />
          </View>

          <TouchableOpacity
            style={styles.anonymousToggle}
            onPress={() => setIsAnonymous((prev) => !prev)}
          >
            <View style={styles.toggleLeft}>
              <Ionicons
                name={isAnonymous ? "shield-checkmark" : "person"}
                size={18}
                color="#3D2B1F"
              />
              <Text style={styles.toggleText}>
                {isAnonymous ? "Anonymous Post" : "Show Username"}
              </Text>
            </View>
            <Ionicons
              name={isAnonymous ? "checkmark-circle" : "ellipse-outline"}
              size={20}
              color="#3D2B1F"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.postButton,
            (!isFormFilled || isLoading) && styles.disabledBtn,
          ]}
          onPress={handlePost}
          disabled={!isFormFilled || isLoading}
        >
          <Text style={styles.postText}>
            {isLoading ? "Posting..." : "Share to Community Feed"}
          </Text>
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
  content: {
    paddingHorizontal: 20,
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
    backgroundColor: "#F7EBDD",
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "800",
    color: "#3D2B1F",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#7A4B2F",
    marginBottom: 24,
  },
  form: {
    gap: 18,
  },
  input: {
    backgroundColor: "#FFF8EE",
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  textarea: {
    backgroundColor: "#FFF8EE",
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ECD8C1",
    minHeight: 150,
    maxHeight: 180,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3D2B1F",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#7A4B2F",
  },
  topicRow: {
    justifyContent: "space-between",
  },
  topicTag: {
    flex: 1,
    backgroundColor: "#F4E8CA",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 18,
    margin: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCC7A0",
  },
  selectedTopic: {
    backgroundColor: "#7A4B2F",
    borderColor: "#7A4B2F",
  },
  topicText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7A4B2F",
  },
  selectedTopicText: {
    color: "#fff",
  },
  anonymousToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF8EE",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ECD8C1",
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3D2B1F",
  },
  postButton: {
    backgroundColor: "#7A4B2F",
    paddingVertical: 15,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 24,
  },
  disabledBtn: {
    backgroundColor: "rgba(139,90,60,0.5)",
  },
  postText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
