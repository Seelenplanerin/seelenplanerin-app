import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

const ROSE = "#C4826A";
const MUTED = "#B8A09A";
const BG = "#FDF8F4";
const BORDER = "#EDD9D0";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 60 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ROSE,
        tabBarInactiveTintColor: MUTED,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarStyle: {
          paddingTop: 8,
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
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="sparkles" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rituale"
        options={{
          title: "Rituale",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="leaf.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="pencil.and.outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ich"
        options={{
          title: "Ich",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.fill" color={color} />,
        }}
      />
      {/* Versteckte Screens – nicht in Tab-Bar */}
      <Tabs.Screen name="entdecken" options={{ href: null }} />
      <Tabs.Screen name="favoriten" options={{ href: null }} />
      <Tabs.Screen name="lara" options={{ href: null }} />
      <Tabs.Screen name="mond" options={{ href: null }} />
      <Tabs.Screen name="runen" options={{ href: null }} />
    </Tabs>
  );
}
