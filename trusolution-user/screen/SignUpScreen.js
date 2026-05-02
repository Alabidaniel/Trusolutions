import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    navigation.navigate("SelectIssues");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Set up your account and personalize your support.</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color="#8A6A57" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#8F7B6D"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color="#8A6A57" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8F7B6D"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#8A6A57" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#8F7B6D"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  hero: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#3D2B1F",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#8A6A57",
  },
  formCard: {
    backgroundColor: "#FFF8EE",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ECD8C1",
    padding: 16,
    marginBottom: 14,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F1E5",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ECD8C1",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#3D2B1F",
    paddingVertical: 13,
    paddingLeft: 8,
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
  linkButton: {
    alignSelf: "center",
    paddingVertical: 8,
  },
  linkText: {
    color: "#3D2B1F",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default SignUpScreen;
