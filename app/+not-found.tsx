import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { AlertCircle } from "lucide-react-native";

export default function NotFoundScreen() {
  const { theme } = useTheme();
  
  return (
    <>
      <Stack.Screen options={{ title: "Oops!", headerShown: false }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <AlertCircle size={64} color={theme.primary} strokeWidth={1.5} />
        <Text style={[styles.title, { color: theme.text }]}>Page not found</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          The page you&apos;re looking for doesn&apos;t exist.
        </Text>

        <Link href="/" style={[styles.link, { backgroundColor: theme.primary }]}>
          <Text style={styles.linkText}>Go to home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800" as const,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
  },
  link: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
