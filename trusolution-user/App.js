import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import SplashScreen from "./screen/SplashScreen";
import OnboardingScreen1 from "./screen/OnboardingScreen1";
import OnboardingScreen2 from "./screen/OnboardingScreen2";
import OnboardingScreen3 from "./screen/OnboardingScreen3";
import SignUpScreen from "./screen/SignUpScreen";
import SignInScreen from "./screen/SignInScreen";
import SelectIssuesScreen from "./screen/SelectIssuesScreen";
import WelcomeAboardScreen from "./screen/WelcomeAboardScreen";
import ShareExperienceScreen from "./screen/ShareExperienceScreen";
import ChatWithPeerScreen from "./screen/FindPeerScreen";
import PeerMatchingScreen from "./screen/PeerMatchingScreen";
import SearchingScreen from "./screen/SearchingScreen";
import PeerChatScreen from "./screen/PeerChatScreen";
import RatePeerScreen from "./screen/RatePeerScreen";
import ProfileModeScreen from "./screen/ProfileModeScreen";
import GhostModeScreen from "./screen/GhostModeScreen";
import MaskedModeScreen from "./screen/MaskedModeScreen";
import OpenModeScreen from "./screen/OpenModeScreen";
import SharingModeScreen from "./screen/SharingModeScreen";
import FocusModeScreen from "./screen/FocusModeScreen";
import TherapistScreen from "./screen/TherapistScreen";

import TherapistProfileScreen from "./screen/TherapistProfileScreen";

import TherapistBookingScreen from "./screen/TherapistBookingScreen";
import TherapistBookingSuccessScreen from "./screen/TherapistBookingSuccessScreen";
import AppointmentDetailsScreen from "./screen/AppointmentDetailsScreen";
import MoodCheckScreen from "./screen/MoodCheckScreen";
import MoodCheckSuccessScreen from "./screen/MoodCheckSuccessScreen";
import MoodProgressScreen from "./screen/MoodProgressScreen";
import AccountSettingsScreen from "./screen/AccountSettingsScreen";
import PrivacySettingsScreen from "./screen/PrivacySettingsScreen";
import NotificationSettingsScreen from "./screen/NotificationSettingsScreen";
import DataStorageScreen from "./screen/DataStorageScreen";
import HelpSupportScreen from "./screen/HelpSupportScreen";
import AboutTruSolutionScreen from "./screen/AboutTruSolutionScreen";
import TabNavigator from "./TabNavigator";
import { CommunityProvider } from "./context/CommunityContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <CommunityProvider>
        <AppointmentProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator
              initialRouteName="Splash"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
              <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
              <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SelectIssues" component={SelectIssuesScreen} />
              <Stack.Screen
                name="WelcomeAboard"
                component={WelcomeAboardScreen}
              />
              <Stack.Screen
                name="ShareExperience"
                component={ShareExperienceScreen}
              />
              <Stack.Screen name="ChatWithPeer" component={ChatWithPeerScreen} />
              <Stack.Screen name="PeerMatching" component={PeerMatchingScreen} />
              <Stack.Screen name="Searching" component={SearchingScreen} />
              <Stack.Screen name="PeerChat" component={PeerChatScreen} />
              <Stack.Screen name="RatePeer" component={RatePeerScreen} />
              <Stack.Screen name="ProfileMode" component={ProfileModeScreen} />
              <Stack.Screen name="GhostMode" component={GhostModeScreen} />
              <Stack.Screen name="MaskedMode" component={MaskedModeScreen} />
              <Stack.Screen name="OpenMode" component={OpenModeScreen} />
              <Stack.Screen name="SharingMode" component={SharingModeScreen} />
              <Stack.Screen name="FocusMode" component={FocusModeScreen} />
              <Stack.Screen name="Therapist" component={TherapistScreen} />

              <Stack.Screen
                name="TherapistProfile"
                component={TherapistProfileScreen}
              />
              <Stack.Screen
                name="TherapistBooking"
                component={TherapistBookingScreen}
              />
              <Stack.Screen
                name="TherapistBookingSuccess"
                component={TherapistBookingSuccessScreen}
              />
              <Stack.Screen
                name="AppointmentDetails"
                component={AppointmentDetailsScreen}
              />
              <Stack.Screen name="MoodCheck" component={MoodCheckScreen} />
              <Stack.Screen
                name="MoodCheckSuccess"
                component={MoodCheckSuccessScreen}
              />
              <Stack.Screen name="MoodProgress" component={MoodProgressScreen} />
              <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
              <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
              <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
              <Stack.Screen name="DataStorage" component={DataStorageScreen} />
              <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
              <Stack.Screen name="AboutTruSolution" component={AboutTruSolutionScreen} />
              <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AppointmentProvider>
      </CommunityProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});


