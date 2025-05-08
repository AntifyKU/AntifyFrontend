import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the explore tab by default
  return <Redirect href="/(tabs)/explore" />;
}