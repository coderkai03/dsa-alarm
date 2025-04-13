import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import GitHubSignIn from '@/components/GitHubSignIn';
import { GitHubProfile } from '@/types/github-profile';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [githubProfile, setGitHubProfile] = useState<GitHubProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (githubProfile) {
      router.push({
        pathname: '/(tabs)/alarms',
        params: { profile: JSON.stringify(githubProfile) }
      });
    }
  }, [githubProfile]);

  return (
    <ThemedView style={styles.container}>
      <GitHubSignIn setGitHubProfile={setGitHubProfile} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});