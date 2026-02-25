// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings for Die Seelenplanerin app.
 */
const MAPPING: Partial<IconMapping> = {
  "house.fill": "home",
  "moon.fill": "nightlight-round",
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "magnifyingglass": "search",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "star.fill": "star",
  "star": "star-border",
  "leaf.fill": "spa",
  "flame.fill": "local-fire-department",
  "drop.fill": "water-drop",
  "sun.max.fill": "wb-sunny",
  "book.fill": "menu-book",
  "quote.bubble.fill": "format-quote",
  "bolt.fill": "bolt",
  "wand.and.stars": "auto-fix-high",
  "xmark": "close",
  "arrow.left": "arrow-back",
  "clock.fill": "schedule",
  "person.fill": "person",
  "sparkles": "auto-awesome",
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
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
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={(MAPPING as IconMapping)[name]} style={style} />;
}
