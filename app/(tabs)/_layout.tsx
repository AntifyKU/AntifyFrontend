import { Tabs as ExpoTabs } from "expo-router";
import Tabs from "@/components/molecule/Tabs";

export default function TabLayout() {
  return (
    <ExpoTabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <Tabs {...props} />}
    >
      <ExpoTabs.Screen name="Home" />
      <ExpoTabs.Screen name="explore" />
      <ExpoTabs.Screen name="camera" />
      <ExpoTabs.Screen name="collection" />
      <ExpoTabs.Screen name="me" />
    </ExpoTabs>
  );
}
