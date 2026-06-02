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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OpenModeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [image, setImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");

  const pickImage = async () => {
    alert("Install expo-image-picker for gallery access!");
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
        <Text style={styles.title}>You are in Open Mode</Text>
        <Text style={styles.subtitle}>Your visible profile will be shown during chats.</Text>

        <View style={styles.card}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <View style={styles.emptyImageContainer}>
                <Ionicons name="camera-outline" size={24} color="#7A4B2F" />
                <Text style={styles.emptyImageText}>Add profile photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#8F7B6D"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />

          <TextInput
            placeholder="Bio"
            placeholderTextColor="#8F7B6D"
            value={bio}
            onChangeText={setBio}
            style={[styles.input, styles.textArea]}
            multiline
          />

          <View style={styles.previewCard}>
            <Image
              source={
                image
                  ? { uri: image }
                  : require("../assets/avatar1.png")
              }
              style={styles.previewAvatar}
            />
            <View>
              <Text style={styles.previewName}>{fullName || "Full Name"}</Text>
              <Text style={styles.previewBio}>{bio || "Short bio will appear here"}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SharingMode")}
        >
          <Text style={styles.buttonText}>Continue as Open</Text>
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
    marginBottom: 12,
  },
  imageContainer: {
    alignSelf: "center",
    marginBottom: 12,
  },
  emptyImageContainer: {
    width: 122,
    height: 122,
    borderRadius: 61,
    borderWidth: 1,
    borderColor: "#E4C9A8",
    backgroundColor: "#F9F1E5",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  emptyImageText: {
    color: "#7A4B2F",
    fontSize: 12,
    fontWeight: "700",
  },
  profileImage: {
    width: 122,
    height: 122,
    borderRadius: 61,
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
    marginBottom: 10,
  },
  textArea: {
    minHeight: 92,
    textAlignVertical: "top",
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
    gap: 10,
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  previewName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#3D2B1F",
  },
  previewBio: {
    marginTop: 2,
    fontSize: 12,
    color: "#8A6A57",
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
