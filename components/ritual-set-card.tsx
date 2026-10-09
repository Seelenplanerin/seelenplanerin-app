import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { RitualSet } from "@/data/ritual-sets";
import { openSeelenplanerinUrl } from "@/lib/open-owned-url";

export function RitualSetCard({ set }: { set: RitualSet }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: set.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={250}
      />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>PASSEND ZU DIESEM RITUAL</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{set.name}</Text>
          <Text style={styles.price}>{set.priceLabel}</Text>
        </View>
        <Text style={styles.description}>{set.description}</Text>
        <Text style={styles.components}>{set.components.join(" · ")}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => void openSeelenplanerinUrl(set.url)}
          activeOpacity={0.85}
          accessibilityRole="link"
          accessibilityLabel={`${set.name} im Shop ansehen`}
        >
          <Text style={styles.buttonText}>{set.name} ansehen →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8D5B0",
  },
  image: { width: "100%", height: 210, backgroundColor: "#F5EEE8" },
  content: { padding: 18 },
  eyebrow: {
    fontSize: 11,
    color: "#C4826A",
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  title: { flex: 1, fontSize: 18, fontWeight: "700", color: "#5C3317", lineHeight: 23 },
  price: { fontSize: 18, fontWeight: "800", color: "#C4826A" },
  description: { fontSize: 13, color: "#8B5E3C", lineHeight: 20, marginTop: 8 },
  components: { fontSize: 12, color: "#A08070", lineHeight: 18, marginTop: 8, marginBottom: 14 },
  button: { backgroundColor: "#C4826A", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14, textAlign: "center" },
});
