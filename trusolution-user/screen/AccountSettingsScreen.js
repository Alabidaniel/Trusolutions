import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AccountSettingsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState("Prince User");
  const [email, setEmail] = useState("prince@example.com");
  const [username, setUsername] = useState("@prince");

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={30} color="#FFF8EC" />
          </View>
          <Text style={styles.profileName}>{fullName}</Text>
          <Text style={styles.profileMeta}>Community member since March 2026</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full name"
            placeholderTextColor="#8B7355"
          />
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor="#8B7355"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor="#8B7355"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Access</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Sign-in Method</Text>
            <Text style={styles.infoValue}>Email and password</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Recovery Email</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
    padding: 18,
    paddingBottom: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F7EBDD",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#3D2B1F",
  },
  headerSpacer: {
    width: 40,
  },
  profileCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#7A4B2F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#4A2818",
  },
  profileMeta: {
    fontSize: 13,
    color: "#7B6753",
    marginTop: 6,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#FFF8EE",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECD8C1",
    color: "#4A2818",
  },
  infoCard: {
    backgroundColor: "#F7EBDD",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 13,
    color: "#7B6753",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4A2818",
  },
  saveButton: {
    backgroundColor: "#3D2B1F",
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF8EC",
    fontSize: 16,
    fontWeight: "800",
  },
});
