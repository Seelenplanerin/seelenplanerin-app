import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from "react-native-svg";

interface MoonIconProps {
  /** Beleuchtung in Prozent (0-100) */
  illumination: number;
  /** Ob der Mond zunimmt (true) oder abnimmt (false) */
  isWaxing: boolean;
  /** Größe des Icons in Pixel */
  size?: number;
  /** Hintergrundfarbe (für den dunklen Teil) */
  darkColor?: string;
  /** Farbe des beleuchteten Teils */
  lightColor?: string;
}

/**
 * SVG-basierte Mondphasen-Darstellung.
 * Zeigt die korrekte Beleuchtung unabhängig vom Gerät/OS.
 * Inspiriert von MoonWorx.
 */
export function MoonIcon({
  illumination,
  isWaxing,
  size = 80,
  darkColor = "#2A2F45",
  lightColor = "#F5E6C8",
}: MoonIconProps) {
  const r = size / 2;
  const cx = r;
  const cy = r;

  // Berechne den Terminator (Grenze zwischen Licht und Schatten)
  // illumination 0 = Neumond (ganz dunkel)
  // illumination 50 = Halbmond
  // illumination 100 = Vollmond (ganz hell)
  const illumFraction = Math.max(0, Math.min(100, illumination)) / 100;

  // Berechne den Kontrollpunkt für die Bézier-Kurve des Terminators
  // Bei 0% ist der Terminator am rechten Rand (zunehmend) oder linken Rand (abnehmend)
  // Bei 50% ist er in der Mitte
  // Bei 100% ist er am anderen Rand
  const terminatorX = illumFraction * 2 * r;

  // Erstelle den beleuchteten Pfad
  let lightPath: string;

  if (illumination <= 1) {
    // Neumond - komplett dunkel
    lightPath = "";
  } else if (illumination >= 99) {
    // Vollmond - komplett hell
    lightPath = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`;
  } else {
    // Berechne den Terminator als Ellipse
    // Die Breite der Ellipse bestimmt wie viel beleuchtet ist
    const ellipseRx = Math.abs(r * (2 * illumFraction - 1));
    const sweepOuter = 1; // Äußerer Bogen immer von oben nach unten

    if (isWaxing) {
      // Zunehmend: Beleuchtung von rechts
      if (illumFraction < 0.5) {
        // Weniger als Halbmond: schmaler beleuchteter Streifen rechts
        lightPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${ellipseRx} ${r} 0 0 1 ${cx} ${cy - r}`;
      } else {
        // Mehr als Halbmond: großer beleuchteter Bereich
        lightPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${ellipseRx} ${r} 0 0 0 ${cx} ${cy - r}`;
      }
    } else {
      // Abnehmend: Beleuchtung von links
      if (illumFraction < 0.5) {
        // Weniger als Halbmond: schmaler beleuchteter Streifen links
        lightPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${ellipseRx} ${r} 0 0 0 ${cx} ${cy - r}`;
      } else {
        // Mehr als Halbmond: großer beleuchteter Bereich
        lightPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${ellipseRx} ${r} 0 0 1 ${cx} ${cy - r}`;
      }
    }
  }

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={lightColor} stopOpacity="1" />
            <Stop offset="85%" stopColor={lightColor} stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#D4C4A0" stopOpacity="0.7" />
          </RadialGradient>
          <RadialGradient id="moonDark" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={darkColor} stopOpacity="1" />
            <Stop offset="90%" stopColor="#1A1F30" stopOpacity="1" />
            <Stop offset="100%" stopColor="#151828" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        {/* Dunkler Hintergrund (Mond-Scheibe) */}
        <Circle cx={cx} cy={cy} r={r - 1} fill="url(#moonDark)" />
        {/* Beleuchteter Teil */}
        {lightPath ? (
          <Path d={lightPath} fill="url(#moonGlow)" />
        ) : null}
        {/* Subtiler Rand */}
        <Circle cx={cx} cy={cy} r={r - 1} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </Svg>
    </View>
  );
}

/**
 * Kleine Mondphasen-Darstellung für Kalender und Listen.
 */
export function MoonIconSmall({
  illumination,
  isWaxing,
  size = 24,
}: {
  illumination: number;
  isWaxing: boolean;
  size?: number;
}) {
  return (
    <MoonIcon
      illumination={illumination}
      isWaxing={isWaxing}
      size={size}
      darkColor="#2A2F45"
      lightColor="#F5E6C8"
    />
  );
}
