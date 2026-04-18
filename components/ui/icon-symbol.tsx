import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING: IconMapping = {
  // Tab Icons
  "house.fill": "home",
  "sparkles": "auto-awesome",
  "book.fill": "menu-book",
  "pencil.and.outline": "edit-note",
  "person.2.fill": "group",
  "person.fill": "person",
  // Navigation
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.left.forwardslash.chevron.right": "code",
  // Actions
  "paperplane.fill": "send",
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "bookmark.fill": "bookmark",
  "bookmark": "bookmark-border",
  "share": "share",
  "plus": "add",
  "xmark": "close",
  "trash": "delete",
  "pencil": "edit",
  "magnifyingglass": "search",
  "bell.fill": "notifications",
  "gear": "settings",
  "lock.fill": "lock",
  "star.fill": "star",
  "moon.fill": "nightlight-round",
  "sun.max.fill": "wb-sunny",
  "leaf.fill": "eco",
  "flame.fill": "local-fire-department",
  "drop.fill": "water-drop",
  "wind": "air",
  "cart.fill": "shopping-cart",
  "bag.fill": "shopping-bag",
  "calendar": "calendar-today",
  "clock.fill": "access-time",
  "arrow.right": "arrow-forward",
  "arrow.left": "arrow-back",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  "info.circle": "info",
  "crown.fill": "workspace-premium",
  "sparkle": "auto-awesome",
  "storefront.fill": "storefront",
};

/**
 * SVG Heart icon - renders reliably on all platforms without font loading
 */
function HeartIcon({ size, color, filled = true }: { size: number; color: string | OpaqueColorValue; filled?: boolean }) {
  const c = typeof color === "string" ? color : "#C4826A";
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={c}
        />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
        fill={c}
      />
    </Svg>
  );
}

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolViewProps["weight"];
}) {
  // For heart icons, use SVG directly (reliable on all platforms)
  if (name === "heart.fill") {
    return <HeartIcon size={size} color={color} filled={true} />;
  }
  if (name === "heart") {
    return <HeartIcon size={size} color={color} filled={false} />;
  }

  const iconName = MAPPING[name] ?? "help-outline";
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
