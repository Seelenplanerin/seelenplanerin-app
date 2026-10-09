import { Alert, Linking, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";

import { getOwnedSeelenplanerinUrl } from "@/lib/link-security";

export async function openSeelenplanerinUrl(value: string): Promise<boolean> {
  const safeUrl = getOwnedSeelenplanerinUrl(value);

  if (!safeUrl) {
    console.warn("[Link-Sicherheit] Fremder Link blockiert:", value);
    Alert.alert(
      "Link aus Sicherheitsgründen blockiert",
      "Die App öffnet für Shop, Buchung und Angebote ausschließlich dieseelenplanerin.de.",
    );
    return false;
  }

  try {
    if (Platform.OS !== "web") {
      await WebBrowser.openBrowserAsync(safeUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        controlsColor: "#C4897B",
        toolbarColor: "#FFF8F5",
      });
    } else {
      await Linking.openURL(safeUrl);
    }
    return true;
  } catch (error) {
    console.error("[Link-Sicherheit] Link konnte nicht geöffnet werden:", error);
    Alert.alert("Link konnte nicht geöffnet werden", "Bitte versuche es noch einmal.");
    return false;
  }
}
