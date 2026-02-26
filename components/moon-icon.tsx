import React from "react";
import { View } from "react-native";
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from "react-native-svg";

interface MoonIconProps {
  /** Beleuchtung in Prozent (0-100) */
  illumination: number;
  /** Ob der Mond zunimmt (true) oder abnimmt (false) */
  isWaxing: boolean;
  /** Größe des Icons in Pixel */
  size?: number;
}

/**
 * SVG-basierte Mondphasen-Darstellung.
 * 
 * WICHTIG – Beleuchtungsregeln (Nordhalbkugel):
 * - Zunehmend (isWaxing=true): RECHTE Seite beleuchtet
 * - Abnehmend (isWaxing=false): LINKE Seite beleuchtet
 * - Neumond (illumination=0): komplett dunkel
 * - Vollmond (illumination=100): komplett hell
 */
export function MoonIcon({
  illumination,
  isWaxing,
  size = 80,
}: MoonIconProps) {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const moonR = r - 1; // Etwas kleiner als Container für Rand

  // Normalisiere Beleuchtung
  const illum = Math.max(0, Math.min(100, Math.round(illumination)));

  // Berechne den beleuchteten Pfad
  let lightPath = "";

  if (illum <= 1) {
    // Neumond – komplett dunkel, kein Lichtpfad
    lightPath = "";
  } else if (illum >= 99) {
    // Vollmond – komplett hell (voller Kreis)
    lightPath = [
      `M ${cx} ${cy - moonR}`,
      `A ${moonR} ${moonR} 0 1 0 ${cx} ${cy + moonR}`,
      `A ${moonR} ${moonR} 0 1 0 ${cx} ${cy - moonR}`,
      "Z",
    ].join(" ");
  } else {
    // Teilweise beleuchtet
    // f geht von 0.0 (Neumond) bis 1.0 (Vollmond)
    const f = illum / 100;

    // Der Terminator ist eine Ellipse. Ihre X-Radius bestimmt die Form:
    // - Bei f=0.5 (Halbmond): Terminator ist eine gerade Linie (ellipseRx=0)
    // - Bei f<0.5: Terminator wölbt sich IN den beleuchteten Bereich
    // - Bei f>0.5: Terminator wölbt sich IN den dunklen Bereich
    const ellipseRx = Math.abs(moonR * (2 * f - 1));

    // Sweep-Flags für den inneren Bogen (Terminator-Ellipse)
    // bestimmen, ob die Ellipse nach innen oder außen gewölbt ist
    const innerSweep = f > 0.5 ? 0 : 1;

    if (isWaxing) {
      // ZUNEHMEND: Rechte Seite beleuchtet
      // Äußerer Bogen: von oben nach unten über RECHTS (sweep=1, large-arc=0 für Halbkreis rechts)
      // Innerer Bogen (Terminator): von unten zurück nach oben
      lightPath = [
        `M ${cx} ${cy - moonR}`,
        // Äußerer Bogen: rechte Hälfte des Kreises (von oben nach unten)
        `A ${moonR} ${moonR} 0 0 1 ${cx} ${cy + moonR}`,
        // Terminator-Ellipse: von unten nach oben
        `A ${ellipseRx} ${moonR} 0 0 ${innerSweep} ${cx} ${cy - moonR}`,
        "Z",
      ].join(" ");
    } else {
      // ABNEHMEND: Linke Seite beleuchtet
      // Äußerer Bogen: von oben nach unten über LINKS (sweep=0)
      // Innerer Bogen (Terminator): von unten zurück nach oben
      lightPath = [
        `M ${cx} ${cy - moonR}`,
        // Äußerer Bogen: linke Hälfte des Kreises (von oben nach unten)
        `A ${moonR} ${moonR} 0 0 0 ${cx} ${cy + moonR}`,
        // Terminator-Ellipse: von unten nach oben
        `A ${ellipseRx} ${moonR} 0 0 ${1 - innerSweep} ${cx} ${cy - moonR}`,
        "Z",
      ].join(" ");
    }
  }

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id="moonGlow" cx="50%" cy="45%" r="55%">
            <Stop offset="0%" stopColor="#FFF8E7" stopOpacity="1" />
            <Stop offset="60%" stopColor="#F5E6C8" stopOpacity="1" />
            <Stop offset="100%" stopColor="#D4C4A0" stopOpacity="0.85" />
          </RadialGradient>
          <RadialGradient id="moonDark" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#2A2F45" stopOpacity="1" />
            <Stop offset="85%" stopColor="#1E2235" stopOpacity="1" />
            <Stop offset="100%" stopColor="#151828" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        {/* Dunkler Hintergrund (Mond-Scheibe) */}
        <Circle cx={cx} cy={cy} r={moonR} fill="url(#moonDark)" />
        {/* Beleuchteter Teil */}
        {lightPath ? (
          <Path d={lightPath} fill="url(#moonGlow)" />
        ) : null}
        {/* Subtiler Rand */}
        <Circle
          cx={cx} cy={cy} r={moonR}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
        />
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
    />
  );
}
