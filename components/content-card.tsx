import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useFavorites } from "@/lib/favorites-store";
import { useColors } from "@/hooks/use-colors";
import type { ContentItem } from "@/lib/content-data";
import { CATEGORY_CONFIG } from "@/lib/content-data";

interface ContentCardProps {
  item: ContentItem;
  compact?: boolean;
}

export function ContentCard({ item, compact = false }: ContentCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const colors = useColors();
  const categoryConfig = CATEGORY_CONFIG[item.category];
  const favorite = isFavorite(item.id);

  return (
    <Pressable
      onPress={() => router.push(`/content/${item.id}` as any)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        compact && styles.cardCompact,
      ]}
    >
      {/* Color accent bar */}
      <View style={[styles.accentBar, { backgroundColor: item.color }]} />

      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.categoryBadge}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={[styles.categoryLabel, { color: colors.muted }]}>
              {categoryConfig.label}
            </Text>
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            style={styles.favoriteButton}
          >
            <IconSymbol
              name={favorite ? "heart.fill" : "heart"}
              size={20}
              color={favorite ? "#E8B4B8" : colors.muted}
            />
          </Pressable>
        </View>

        {/* Title */}
        <Text
          style={[styles.title, { color: colors.foreground }]}
          numberOfLines={compact ? 1 : 2}
        >
          {item.title}
        </Text>

        {/* Subtitle */}
        {item.subtitle && !compact && (
          <Text
            style={[styles.subtitle, { color: colors.muted }]}
            numberOfLines={1}
          >
            {item.subtitle}
          </Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {item.duration && (
            <View style={styles.durationBadge}>
              <IconSymbol name="clock.fill" size={12} color={colors.muted} />
              <Text style={[styles.durationText, { color: colors.muted }]}>
                {item.duration}
              </Text>
            </View>
          )}
          {!compact && (
            <View style={styles.tags}>
              {item.tags.slice(0, 2).map((tag) => (
                <View
                  key={tag}
                  style={[styles.tag, { backgroundColor: colors.border }]}
                >
                  <Text style={[styles.tagText, { color: colors.muted }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCompact: {
    marginBottom: 8,
  },
  accentBar: {
    height: 4,
    width: "100%",
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  emoji: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  favoriteButton: {
    padding: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    fontSize: 12,
  },
  tags: {
    flexDirection: "row",
    gap: 6,
    flex: 1,
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "500",
  },
});
