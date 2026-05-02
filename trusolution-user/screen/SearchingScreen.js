import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function SearchingScreen({ route }) {
  const insets = useSafeAreaInsets();
  const { selectedTopics = [], conversationStyle = "Both" } =
    route.params || {};
  const navigation = useNavigation();
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const cancelSearch = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Animated.View
        style={[
          styles.loaderContainer,
          {
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.loaderDot,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
        <View style={styles.loaderRing} />
      </Animated.View>

      <Text style={styles.title}>FINDING THE RIGHT PERSON FOR YOU</Text>

      {selectedTopics.length > 0 && (
        <View style={styles.topicsContainer}>
          <Text style={styles.subtitle}>Looking for peers matching:</Text>
          <View style={styles.topicsList}>
            {selectedTopics.slice(0, 3).map((topic, index) => (
              <View key={index} style={styles.topicChip}>
                <Text style={styles.topicChipText}>{topic}</Text>
              </View>
            ))}
            {selectedTopics.length > 3 && (
              <Text style={styles.moreTopics}>
                +{selectedTopics.length - 3} more
              </Text>
            )}
          </View>
        </View>
      )}

      <Text style={styles.subtitle}>
        {conversationStyle} style {"\u2022"} This may take a moment
      </Text>

      <TouchableOpacity style={styles.cancelBtn} onPress={cancelSearch}>
        <Text style={styles.cancelText}>Cancel Search</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.findBtn}
        onPress={() =>
          navigation.navigate("PeerChat", {
            selectedTopics,
            conversationStyle,
            peerName: "Alex (Anxiety Support)",
          })
        }
      >
        <Text style={styles.findText}>Found Peer! Start Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E6CB",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  loaderContainer: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    position: "relative",
  },
  loaderDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#6B3A24",
    position: "absolute",
    zIndex: 2,
  },
  loaderRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderTopColor: "#6B3A24",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    position: "absolute",
    zIndex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "#6B3A24",
    marginTop: 40,
  },
  subtitle: {
    color: "#8B7355",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
    maxWidth: 300,
  },
  topicsContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  topicsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
  },
  topicChip: {
    backgroundColor: "#F7EBDD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D4B87A",
  },
  topicChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B3A24",
  },
  moreTopics: {
    color: "#8B7355",
    fontSize: 13,
    marginLeft: 8,
  },
  cancelBtn: {
    backgroundColor: "#F7EBDD",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#6B3A24",
    marginBottom: 20,
  },
  cancelText: {
    color: "#6B3A24",
    fontWeight: "bold",
    fontSize: 16,
  },
  findBtn: {
    backgroundColor: "#6B3A24",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 40,
  },
  findText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
