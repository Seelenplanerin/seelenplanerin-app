import React from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ContentCard } from "@/components/content-card";
import { useColors } from "@/hooks/use-colors";
import { useFavorites } from "@/lib/favorites-store";
import { CONTENT_DATA } from "@/lib/content-data";

export default function FavoritenScreen() {
  const colors = useColors();
  const { favorites } = useFavorites();

  const favoriteItems = CONTENT_DATA.filter((item) => favorites.has(item.id));

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Favoriten</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {favoriteItems.length > 0
            ? `${favoriteItems.length} gespeicherte Inhalte`
            : "Deine gespeicherten Inhalte"}
        </Text>
      </View>

      {/* Content */}
      <FlatList
        data={favoriteItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContentCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💜</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Noch keine Favoriten
            </Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Tippe auf das Herz-Symbol bei einem Inhalt, um ihn zu speichern.
            </Text>
            <View style={[styles.emptyHint, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.emptyHintText, { color: colors.muted }]}>
                🌙 Entdecke Rituale, Meditationen, Gedichte und Impulse im Entdecken-Tab
              </Text>
            </View>
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
    paddingBottom: 16,
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyHint: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginTop: 8,
  },
  emptyHintText: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
});
