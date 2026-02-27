import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

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
  const iconName = MAPPING[name] ?? "help-outline";
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
