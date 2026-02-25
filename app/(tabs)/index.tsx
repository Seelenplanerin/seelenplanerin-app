import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { ContentCard } from "@/components/content-card";
import { useColors } from "@/hooks/use-colors";
import { getDailyImpulse, CONTENT_DATA, CATEGORY_CONFIG, ContentCategory } from "@/lib/content-data";
import { getCurrentMoonPhase } from "@/lib/moon-phase";

const CATEGORIES: { key: ContentCategory; route: string }[] = [
  { key: "ritual", route: "/(tabs)/entdecken" },
  { key: "meditation", route: "/(tabs)/entdecken" },
  { key: "gedicht", route: "/(tabs)/entdecken" },
  { key: "impuls", route: "/(tabs)/entdecken" },
];

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const dailyImpulse = getDailyImpulse();
  const moonPhase = getCurrentMoonPhase();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const featuredItems = CONTENT_DATA.slice(0, 3);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: colors.muted }]}>
                Willkommen zurück ✨
              </Text>
              <Text style={[styles.brandName, { color: colors.foreground }]}>
                Die Seelenplanerin
              </Text>
            </View>
            <Text style={styles.moonEmoji}>{moonPhase.emoji}</Text>
          </View>

          {/* Moon Phase Banner */}
          <Pressable
            onPress={() => router.push("/(tabs)/mond" as any)}
            style={({ pressed }) => [
              styles.moonBanner,
              { backgroundColor: "#1A0F2E", opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <View style={styles.moonBannerContent}>
              <Text style={styles.moonBannerEmoji}>{moonPhase.emoji}</Text>
              <View style={styles.moonBannerText}>
                <Text style={styles.moonBannerTitle}>{moonPhase.name}</Text>
                <Text style={styles.moonBannerDesc} numberOfLines={2}>
                  {moonPhase.description}
                </Text>
              </View>
              <View style={[styles.moonBannerBadge, { backgroundColor: "#C9A84C20" }]}>
                <Text style={[styles.moonBannerBadgeText, { color: "#C9A84C" }]}>
                  Mehr →
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Daily Impulse */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              ✨ Tagesimpuls
            </Text>
          </View>
          <Pressable
            onPress={() => router.push(`/content/${dailyImpulse.id}` as any)}
            style={({ pressed }) => [
              styles.impulseCard,
              { backgroundColor: "#7B4FA6", opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={styles.impulseEmoji}>{dailyImpulse.emoji}</Text>
            <Text style={styles.impulseTitle}>{dailyImpulse.title}</Text>
            <Text style={styles.impulseSubtitle} numberOfLines={2}>
              {dailyImpulse.subtitle}
            </Text>
            <View style={styles.impulseButton}>
              <Text style={styles.impulseButtonText}>Jetzt lesen →</Text>
            </View>
          </Pressable>

          {/* Categories */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              🌙 Kategorien
            </Text>
          </View>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map(({ key }) => {
              const config = CATEGORY_CONFIG[key];
              return (
                <Pressable
                  key={key}
                  onPress={() => router.push("/(tabs)/entdecken" as any)}
                  style={({ pressed }) => [
                    styles.categoryCard,
                    {
                      backgroundColor: config.color + "20",
                      borderColor: config.color + "40",
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{config.emoji}</Text>
                  <Text style={[styles.categoryName, { color: colors.foreground }]}>
                    {config.label}
                  </Text>
                  <Text style={[styles.categoryDesc, { color: colors.muted }]} numberOfLines={2}>
                    {config.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Featured Content */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              🌸 Empfohlen für dich
            </Text>
          </View>
          {featuredItems.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}

          {/* Footer Quote */}
          <View style={[styles.quoteContainer, { borderColor: colors.border }]}>
            <Text style={[styles.quoteText, { color: colors.muted }]}>
              "Du bist nicht zu viel. Du bist genau richtig."
            </Text>
            <Text style={[styles.quoteAuthor, { color: colors.primary }]}>
              — Die Seelenplanerin
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 2,
  },
  brandName: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  moonEmoji: {
    fontSize: 36,
  },
  moonBanner: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  moonBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  moonBannerEmoji: {
    fontSize: 32,
  },
  moonBannerText: {
    flex: 1,
  },
  moonBannerTitle: {
    color: "#C9A84C",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  moonBannerDesc: {
    color: "#9B8AAB",
    fontSize: 13,
    lineHeight: 18,
  },
  moonBannerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  moonBannerBadgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  impulseCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  impulseEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  impulseTitle: {
    color: "#FAF7F2",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  impulseSubtitle: {
    color: "#D4C5E2",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  impulseButton: {
    backgroundColor: "#C9A84C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  impulseButtonText: {
    color: "#1A0F2E",
    fontWeight: "700",
    fontSize: 14,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  categoryCard: {
    width: "47%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  quoteContainer: {
    borderTopWidth: 1,
    paddingTop: 20,
    marginTop: 8,
    alignItems: "center",
  },
  quoteText: {
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 6,
  },
  quoteAuthor: {
    fontSize: 13,
    fontWeight: "600",
  },
});
