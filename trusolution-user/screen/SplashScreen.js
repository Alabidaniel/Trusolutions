import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SplashScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Onboarding1");
    }, 800);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#5D3020" />
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.logoTextContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.text}>TRUSOLUTION</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5D3020",
    justifyContent: "center",
    alignItems: "center",
  },
  logoTextContainer: {
    alignItems: "center",
    transform: [{ translateY: 18 }],
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    letterSpacing: 3,
  },
});

export default SplashScreen;
