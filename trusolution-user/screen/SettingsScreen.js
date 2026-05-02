import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const settingsItems = [
    { title: "Account", icon: "person", screen: "AccountSettings" },
    { title: "Privacy", icon: "lock-closed", screen: "PrivacySettings" },
    {
      title: "Notifications",
      icon: "notifications",
      screen: "NotificationSettings",
    },
    { title: "Data & Storage", icon: "cloud", screen: "DataStorage" },
    { title: "Help & Support", icon: "help-circle", screen: "HelpSupport" },
    {
      title: "About TruSolution",
      icon: "information-circle",
      screen: "AboutTruSolution",
    },
  ];

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () =>
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "SignIn" }],
            }),
          ),
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 70 },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>
              Manage your account, privacy, alerts, and app preferences.
            </Text>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons name="settings" size={28} color="#FFF8EC" />
          </View>
        </View>

        <View style={styles.section}>
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.settingItem}
              onPress={() => navigation.navigate(item.screen)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.title}`}
            >
              <View style={styles.itemLeft}>
                <View style={styles.itemIconWrap}>
                  <Ionicons name={item.icon} size={22} color="#3D2B1F" />
                </View>
                <View>
                  <Text style={styles.itemText}>{item.title}</Text>
                  <Text style={styles.itemSubtext}>Open and manage this area</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8B7355" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Ionicons name="log-out-outline" size={20} color="#FFF8EC" />
          <Text style={styles.logoutText}>Log Out</Text>
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
    paddingBottom: 24,
  },
  hero: {
    backgroundColor: "#7A4B2F",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF8EC",
    marginBottom: 6,
  },
  subtitle: {
    maxWidth: 230,
    fontSize: 14,
    lineHeight: 20,
    color: "#F2E1C6",
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,248,236,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: 18,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFF8EE",
    borderRadius: 18,
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  itemIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F7EBDD",
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3D2B1F",
  },
  itemSubtext: {
    fontSize: 12,
    color: "#8B7355",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#B24A3A",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  logoutText: {
    color: "#FFF8EC",
    fontSize: 16,
    fontWeight: "800",
  },
});
