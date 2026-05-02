import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "./screen/HomeScreen";
import InteractionModeScreen from "./screen/InteractionModeScreen";
import SettingsScreen from "./screen/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const tabHeight = 68 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Interact") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#7A4B2F",
        tabBarInactiveTintColor: "#8A6A57",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFF8EE",
          height: tabHeight,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: 1,
          borderTopColor: "#ECD8C1",
          borderRadius: 0,
          shadowOpacity: 0,
          elevation: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Interact" component={InteractionModeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
