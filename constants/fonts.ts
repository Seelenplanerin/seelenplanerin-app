/**
 * Shared font family constants.
 * DancingScript is loaded in _layout.tsx via useFonts.
 * Use these constants in StyleSheet.create() for fontFamily.
 */
export const FONTS = {
  /** Handschrift-Stil für Überschriften und besondere Texte */
  handwriting: "DancingScript",
  /** Fette Variante der Handschrift */
  handwritingBold: "DancingScript-Bold",
} as const;
