import { Alert, Linking } from "react-native";

import { RAUHNAECHTE_PROGRAM } from "@/lib/raunaechte-program";

/**
 * Öffnet das eigenständige Rauhnächte-Journal.
 *
 * Bewusste, einzige Ausnahme von der dieseelenplanerin.de-Regel: feste Adresse,
 * keine Eingabe von außen. Öffnet im System-Browser statt im In-App-Browser,
 * weil das Journal seine Einträge im Browser speichert und sie sonst
 * verloren gehen oder in Safari/Chrome nicht sichtbar wären.
 */
export async function openRauhnaechteJournal(): Promise<boolean> {
  try {
    await Linking.openURL(RAUHNAECHTE_PROGRAM.journalUrl);
    return true;
  } catch (error) {
    console.error("[Journal] Link konnte nicht geöffnet werden:", error);
    Alert.alert("Journal konnte nicht geöffnet werden", "Bitte versuche es noch einmal.");
    return false;
  }
}
