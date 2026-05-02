import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DataStorageScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const items = [
    ["App Cache", "42 MB", "Temporary images and feed content."],
    ["Offline Data", "18 MB", "Saved drafts and recent activity."],
    ["Chat Attachments", "6 MB", "Images shared in conversations."],
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Data & Storage</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Estimated usage</Text>
          <Text style={styles.totalValue}>66 MB</Text>
        </View>

        {items.map(([title, size, desc]) => (
          <View key={title} style={styles.itemCard}>
            <View style={styles.itemTop}>
              <Text style={styles.itemTitle}>{title}</Text>
              <Text style={styles.itemSize}>{size}</Text>
            </View>
            <Text style={styles.itemDesc}>{desc}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Temporary Cache</Text>
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
  totalCard: {
    backgroundColor: "#FFF8EE", borderRadius: 24, padding: 20, marginBottom: 16,
    alignItems: "center",
  },
  totalLabel: { fontSize: 13, color: "#7B6753", marginBottom: 8 },
  totalValue: { fontSize: 30, fontWeight: "800", color: "#4A2818" },
  itemCard: { backgroundColor: "#F7EBDD", borderRadius: 18, padding: 16, marginBottom: 12 },
  itemTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  itemTitle: { fontSize: 16, fontWeight: "800", color: "#4A2818" },
  itemSize: { fontSize: 14, fontWeight: "700", color: "#7A4B2F" },
  itemDesc: { fontSize: 13, lineHeight: 18, color: "#6F5B48" },
  clearButton: { backgroundColor: "#3D2B1F", borderRadius: 28, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  clearButtonText: { color: "#FFF8EC", fontSize: 16, fontWeight: "800" },
});
