import { StyleSheet, View } from 'react-native';
import GitHubSignIn from '@/components/GitHubSignIn';
import { GitHubProfile } from '@/types/github-profile';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import SpaceBackground from '@/components/SpaceBackground';

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
    <View style={styles.container}>
      <SpaceBackground />
      <View style={styles.content}>
        <GitHubSignIn setGitHubProfile={setGitHubProfile} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});