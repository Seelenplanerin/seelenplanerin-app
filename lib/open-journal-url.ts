import { Alert, Linking } from "react-native";
import { RAUHNAECHTE_PROGRAM } from "@/lib/raunaechte-program";
import { requestRauhnaechteAccess } from "./rauhnaechte-access-api";

/** Feste Journaladresse im Systembrowser; niemals Zugangscode oder Geräte-ID in der URL. */
export async function openRauhnaechteJournal(): Promise<boolean> {
  try {
    const result = await requestRauhnaechteAccess<{ ticket: string }>("journal/ticket");
    if (!result.ticket) throw new Error("Keine bestätigte Journal-Freischaltung erhalten.");
    await Linking.openURL(`${RAUHNAECHTE_PROGRAM.journalUrl}#ticket=${encodeURIComponent(result.ticket)}`);
    return true;
  } catch (error) {
    Alert.alert("Journal konnte nicht geöffnet werden", error instanceof Error ? error.message : "Bitte löse zuerst deinen Zugangscode ein.");
    return false;
  }
}
