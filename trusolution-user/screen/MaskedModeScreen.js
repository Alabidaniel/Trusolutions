import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const avatars = [
  require("../assets/avatar1.png"),
  require("../assets/avatar2.png"),
  require("../assets/avatar3.png"),
  require("../assets/avatar4.png"),
  require("../assets/avatar5.png"),
];

export default function MaskedModeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [nickname, setNickname] = useState("");

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
        <Text style={styles.title}>You are in Masked Mode</Text>
        <Text style={styles.subtitle}>Choose an avatar and nickname for private identity.</Text>

        <View style={styles.card}>
          <Image source={selectedAvatar} style={styles.mainAvatar} />

          <View style={styles.avatarRow}>
            {avatars.map((avatar, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedAvatar(avatar)}>
                <Image
                  source={avatar}
                  style={[styles.smallAvatar, avatar === selectedAvatar && styles.smallAvatarActive]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Nickname"
            value={nickname}
            onChangeText={setNickname}
            style={styles.input}
            placeholderTextColor="#8F7B6D"
          />

          <Text style={styles.helperText}>This name will be visible to others.</Text>

          <View style={styles.previewCard}>
            <Image source={selectedAvatar} style={styles.previewAvatar} />
            <Text style={styles.previewText}>{nickname || "Your Nickname"}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("WelcomeAboard")}
        >
          <Text style={styles.buttonText}>Continue as Masked</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ProfileMode")}>
          <Text style={styles.link}>Change connection mode</Text>
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
    paddingHorizontal: 18,
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
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
    marginBottom: 12,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFF8EE",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ECD8C1",
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  mainAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 14,
  },
  avatarRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  smallAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "transparent",
  },
  smallAvatarActive: {
    borderColor: "#7A4B2F",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ECD8C1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#3D2B1F",
    backgroundColor: "#F9F1E5",
  },
  helperText: {
    alignSelf: "flex-start",
    fontSize: 12,
    marginTop: 6,
    marginBottom: 10,
    color: "#8A6A57",
  },
  previewCard: {
    width: "100%",
    backgroundColor: "#F9F1E5",
    borderWidth: 1,
    borderColor: "#ECD8C1",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  previewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  previewText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#3D2B1F",
  },
  button: {
    width: "100%",
    backgroundColor: "#3D2B1F",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFF9F3",
    fontWeight: "800",
    fontSize: 15,
  },
  link: {
    color: "#7A4B2F",
    fontWeight: "700",
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
