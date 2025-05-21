import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme, StyleSheet, Dimensions, Platform, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = colorScheme === "dark" ? "#0e395f" : "#0e395f";
  const circleColor = "#FF5E5E";

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#0e395f",
        headerShown: false,
        tabBarStyle: {
          height: Platform.select({ ios: 85, android: 75 }),
          paddingBottom: Platform.select({ ios: 25, android: 15 }),
          paddingTop: 5,
          borderTopWidth: 1,
          borderTopColor: "#E0E0fd",
          backgroundColor: "white",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          color: "#0e395f",
          fontSize: 13,
          fontWeight: "700",
          marginTop: route.name === "complaint" ? 0 : 8,
          fontFamily: "Inter",
        },
        tabBarIconStyle: {
          marginBottom: -5,
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      {tabsData.map((tab, index) => (
        <Tabs.Screen
          key={index}
          name={tab.name}
          options={{
            tabBarLabel: tab.name === "complaint" ? "" : tab.label,
            tabBarIcon: ({ focused }) => {
              if (tab.name === "complaint") {
                // Special treatment for the complaint tab with a circle
                return (
                  <View style={styles.circleContainer}>
                    <View style={[styles.circle, { backgroundColor: circleColor }]}>
                      <Ionicons
                        name={tab.icon}
                        size={24}
                        color="white"
                      />
                    </View>
                  </View>
                );
              }
              
              // Regular tabs
              return (
                <React.Fragment>
                  {focused && <Ionicons name="ellipse" size={6} color={activeColor} />}
                  <Ionicons
                    name={tab.icon}
                    size={width < 350 ? 24 : 28}
                    color={focused ? activeColor : "#0e395f"}
                  />
                </React.Fragment>
              );
            },
            tabBarItemStyle: 
              tab.name === "complaint" 
                ? { 
                    height: Platform.OS === 'ios' ? 70 : 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }
                : {}
          }}
        />
      ))}
    </Tabs>
  );
}

const tabsData: { name: string; icon: React.ComponentProps<typeof Ionicons>["name"]; label: string }[] = [
  { name: "(home)", icon: "home", label: "Home" },
  { name: "search", icon: "search", label: "Search" },
  { name: "complaint", icon: "document-text", label: "Complaint" },
  { name: "blog", icon: "newspaper", label: "Blog" },
  { name: "settings", icon: "settings", label: "Settings" },
];

const styles = StyleSheet.create({
  tabLabel: {
    color: "#0e395f",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 8,
    fontFamily: "Inter",
  },
  activeTabLabel: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Inter",
  },
  icon: {
    width: width < 350 ? 26 : 30,
    height: width < 350 ? 26 : 30,
    tintColor: "#0e395f",
  },
  activeIcon: {
    tintColor: "#0e395f",
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width: 70,
    marginBottom: Platform.OS === 'ios' ? 30 : 25,
  },
  circle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#FF5E5E",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});