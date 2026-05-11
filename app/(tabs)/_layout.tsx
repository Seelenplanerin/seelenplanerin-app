import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, ScrollView, View, Text, StyleSheet } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

const ROSE = "#C4826A";
const MUTED = "#B8A09A";
const BG = "#FDF8F4";
const BORDER = "#EDD9D0";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 8 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ROSE,
        tabBarInactiveTintColor: MUTED,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarItemStyle: Platform.OS === "web" ? { width: 'auto' as any, minWidth: 50, paddingHorizontal: 2 } : undefined,
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "600",
          marginTop: 1,
        },
        tabBarStyle: {
          paddingTop: 6,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: BG,
          borderTopColor: BORDER,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Aktuelles",
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mond"
        options={{
          title: "Mond",
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rituale"
        options={{
          title: "Rituale",
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="raunaechte"
        options={{
          title: "Raunacht",
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ich"
        options={{
          title: "Ich",
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="heart.fill" color={color} />,
        }}
      />
      {/* Versteckte Screens – nicht in Tab-Bar */}
      <Tabs.Screen name="entdecken" options={{ href: null }} />
      <Tabs.Screen name="favoriten" options={{ href: null }} />
      <Tabs.Screen name="journal" options={{ href: null }} />
      <Tabs.Screen name="lara" options={{ href: null }} />
      <Tabs.Screen name="runen" options={{ href: null }} />
    </Tabs>
  );
}
