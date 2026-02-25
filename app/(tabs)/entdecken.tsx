import React, { useState, useMemo } from "react";
import {
  FlatList,
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ContentCard } from "@/components/content-card";
import { useColors } from "@/hooks/use-colors";
import { CONTENT_DATA, CATEGORY_CONFIG, ContentCategory } from "@/lib/content-data";

const ALL_CATEGORIES: (ContentCategory | "all")[] = ["all", "ritual", "meditation", "gedicht", "impuls"];

const CATEGORY_LABELS: Record<ContentCategory | "all", string> = {
  all: "Alle",
  ritual: "Rituale",
  meditation: "Meditationen",
  gedicht: "Gedichte",
  impuls: "Impulse",
};

const CATEGORY_EMOJIS: Record<ContentCategory | "all", string> = {
  all: "✨",
  ritual: "🕯️",
  meditation: "🌙",
  gedicht: "🌸",
  impuls: "⚡",
};

export default function EntdeckenScreen() {
  const colors = useColors();
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContent = useMemo(() => {
    let items = CONTENT_DATA;
    if (selectedCategory !== "all") {
      items = items.filter((item) => item.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.subtitle?.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return items;
  }, [selectedCategory, searchQuery]);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Entdecken</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Rituale, Meditationen, Gedichte & Impulse
        </Text>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Suchen..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Text style={[styles.clearButton, { color: colors.muted }]}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Category Filter */}
        <View style={styles.filterRow}>
          {ALL_CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.filterPill,
                {
                  backgroundColor:
                    selectedCategory === cat ? colors.primary : colors.surface,
                  borderColor:
                    selectedCategory === cat ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={styles.filterEmoji}>{CATEGORY_EMOJIS[cat]}</Text>
              <Text
                style={[
                  styles.filterLabel,
                  {
                    color: selectedCategory === cat ? "#FAF7F2" : colors.muted,
                  },
                ]}
              >
                {CATEGORY_LABELS[cat]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Content List */}
      <FlatList
        data={filteredContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContentCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌙</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nichts gefunden
            </Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Versuche eine andere Suche oder Kategorie
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 2,
    color: "#3D2B1F",
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 16,
    fontStyle: "italic",
    color: "#9C7B6E",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  clearButton: {
    fontSize: 16,
    padding: 2,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterEmoji: {
    fontSize: 14,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
