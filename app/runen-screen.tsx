// Redirect to the Runen tab – this file exists for backwards compatibility
import { Redirect } from "expo-router";

export default function RunenScreenRedirect() {
  return <Redirect href="/(tabs)/runen" />;
}
