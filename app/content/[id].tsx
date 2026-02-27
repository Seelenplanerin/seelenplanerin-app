import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  Animated,
  Share,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFavorites } from "@/lib/favorites-store";
import { getContentById, CATEGORY_CONFIG } from "@/lib/content-data";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const item = getContentById(id ?? "");
  const favorite = item ? isFavorite(item.id) : false;
  const categoryConfig = item ? CATEGORY_CONFIG[item.category] : null;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleShare = async () => {
    if (!item) return;
    try {
      await Share.share({
        message: `${item.emoji} ${item.title}\n\n${item.content.substring(0, 200)}...\n\n— Die Seelenplanerin`,
        title: item.title,
      });
    } catch (error) {
      // ignore
    }
  };

  if (!item) {
    return (
      <ScreenContainer>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.muted }]}>
            Inhalt nicht gefunden
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.backLink, { color: colors.primary }]}>Zurück</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  // Parse markdown-like content for display
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        // Bold heading
        const content = line.slice(2, -2);
        return (
          <Text key={index} style={[styles.contentHeading, { color: colors.foreground }]}>
            {content}
          </Text>
        );
      } else if (line.startsWith("*") && line.endsWith("*")) {
        // Italic (author)
        const content = line.slice(1, -1);
        return (
          <Text key={index} style={[styles.contentItalic, { color: colors.primary }]}>
            {content}
          </Text>
        );
      } else if (line.match(/^\d+\./)) {
        // Numbered list
        return (
          <Text key={index} style={[styles.contentListItem, { color: colors.foreground }]}>
            {line}
          </Text>
        );
      } else if (line === "") {
        return <View key={index} style={styles.contentSpacer} />;
      } else {
        // Check for inline bold **text**
        const parts = line.split(/\*\*(.*?)\*\*/g);
        if (parts.length > 1) {
          return (
            <Text key={index} style={[styles.contentText, { color: colors.foreground }]}>
              {parts.map((part, i) =>
                i % 2 === 1 ? (
                  <Text key={i} style={{ fontWeight: "700" }}>
                    {part}
                  </Text>
                ) : (
                  part
                )
              )}
            </Text>
          );
        }
        return (
          <Text key={index} style={[styles.contentText, { color: colors.foreground }]}>
            {line}
          </Text>
        );
      }
    });
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Navigation Bar */}
      <View style={[styles.navbar, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <IconSymbol name="arrow.left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.muted }]}>
          {categoryConfig?.label ?? ""}
        </Text>
        <View style={styles.navActions}>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
          >
            <IconSymbol name="paperplane.fill" size={20} color={colors.foreground} />
          </Pressable>
          <Pressable
            onPress={() => toggleFavorite(item.id)}
            style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
          >
            <IconSymbol
              name={favorite ? "heart.fill" : "heart"}
              size={22}
              color={favorite ? "#E8B4B8" : colors.foreground}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Hero */}
          <View style={[styles.hero, { backgroundColor: item.color + "20" }]}>
            <Text style={styles.heroEmoji}>{item.emoji}</Text>
            {item.duration && (
              <View style={[styles.durationBadge, { backgroundColor: colors.surface }]}>
                <IconSymbol name="clock.fill" size={12} color={colors.muted} />
                <Text style={[styles.durationText, { color: colors.muted }]}>
                  {item.duration}
                </Text>
              </View>
            )}
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={[styles.categoryBadge, { backgroundColor: item.color + "20" }]}>
              <Text style={[styles.categoryBadgeText, { color: item.color }]}>
                {categoryConfig?.label}
              </Text>
            </View>
            <Text style={[styles.title, { color: "#3D2B1F" }]}>{item.title}</Text>
            {item.subtitle && (
              <Text style={[styles.subtitle, { color: colors.muted }]}>{item.subtitle}</Text>
            )}

            {/* Tags */}
            <View style={styles.tags}>
              {item.tags.map((tag) => (
                <View key={tag} style={[styles.tag, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.tagText, { color: colors.muted }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Content */}
          <View style={styles.contentSection}>
            {renderContent(item.content)}
          </View>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Pressable
              onPress={() => toggleFavorite(item.id)}
              style={({ pressed }) => [
                styles.favoriteButton,
                {
                  backgroundColor: favorite ? "#E8B4B820" : colors.surface,
                  borderColor: favorite ? "#E8B4B8" : colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <IconSymbol
                name={favorite ? "heart.fill" : "heart"}
                size={20}
                color={favorite ? "#E8B4B8" : colors.muted}
              />
              <Text style={[styles.favoriteButtonText, { color: favorite ? "#E8B4B8" : colors.muted }]}>
                {favorite ? "Gespeichert" : "Speichern"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.shareButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <IconSymbol name="paperplane.fill" size={18} color="#FAF7F2" />
              <Text style={styles.shareButtonText}>Teilen</Text>
            </Pressable>
          </View>

          {/* Brand Footer */}
          <View style={styles.brandFooter}>
            <Text style={[styles.brandText, { color: colors.muted }]}>
              — Die Seelenplanerin
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  navButton: {
    padding: 6,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  navActions: {
    flexDirection: "row",
    gap: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  heroEmoji: {
    fontSize: 72,
  },
  durationBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  durationText: {
    fontSize: 12,
    fontWeight: "500",
  },
  titleSection: {
    padding: 20,
    paddingBottom: 16,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 34,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    fontStyle: "italic",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  contentSection: {
    paddingHorizontal: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 4,
  },
  contentHeading: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 26,
    marginTop: 12,
    marginBottom: 4,
  },
  contentItalic: {
    fontSize: 15,
    fontStyle: "italic",
    lineHeight: 24,
    marginTop: 8,
  },
  contentListItem: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 4,
    paddingLeft: 4,
  },
  contentSpacer: {
    height: 8,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    paddingTop: 24,
    marginTop: 16,
    borderTopWidth: 1,
  },
  favoriteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  favoriteButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  shareButtonText: {
    color: "#FAF7F2",
    fontSize: 15,
    fontWeight: "600",
  },
  brandFooter: {
    alignItems: "center",
    paddingBottom: 8,
  },
  brandText: {
    fontSize: 13,
    fontStyle: "italic",
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
  },
  backLink: {
    fontSize: 16,
    fontWeight: "600",
  },
});
