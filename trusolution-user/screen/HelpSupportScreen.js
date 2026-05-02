import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HelpSupportScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");

  const faq = [
    ["How do I post anonymously?", "Turn on anonymous posting inside Share Experience before posting."],
    ["Can I delete a post later?", "For this prototype, editing and deleting will come in a later update."],
    ["How do I reach a therapist?", "Use the Therapist section from the home screen to browse and book a session."],
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.sectionTitle}>Quick Answers</Text>
        {faq.map(([question, answer]) => (
          <View key={question} style={styles.faqCard}>
            <Text style={styles.question}>{question}</Text>
            <Text style={styles.answer}>{answer}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Contact Support</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Describe what you need help with..."
          placeholderTextColor="#8B7355"
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send Support Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5E6CB" },
  content: { padding: 18, paddingBottom: 28 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#F7EBDD",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 22, fontWeight: "800", color: "#3D2B1F" },
  headerSpacer: { width: 40 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#3D2B1F", marginBottom: 12 },
  faqCard: { backgroundColor: "#FFF8EE", borderRadius: 18, padding: 16, marginBottom: 12 },
  question: { fontSize: 15, fontWeight: "800", color: "#4A2818", marginBottom: 6 },
  answer: { fontSize: 13, lineHeight: 19, color: "#6F5B48" },
  messageInput: {
    backgroundColor: "#FFF8EE", borderRadius: 18, padding: 16, minHeight: 140,
    borderWidth: 1, borderColor: "#ECD8C1", fontSize: 15, color: "#4A2818", marginBottom: 16,
  },
  sendButton: { backgroundColor: "#3D2B1F", borderRadius: 28, paddingVertical: 16, alignItems: "center" },
  sendButtonText: { color: "#FFF8EC", fontSize: 16, fontWeight: "800" },
});
