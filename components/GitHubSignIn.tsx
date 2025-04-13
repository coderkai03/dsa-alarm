import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { GitHubProfile } from '@/types/github-profile';

interface GitHubSignInProps {
  setGitHubProfile: (profile: GitHubProfile | null) => void;
}

export default function GitHubSignIn({ setGitHubProfile }: GitHubSignInProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setGitHubProfile(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 
          ? 'User not found' 
          : 'Error fetching data');
      }

      const userData = await response.json();
      setGitHubProfile({ user: userData });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          GitHub Profile Viewer
        </ThemedText>
        
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter GitHub username"
          placeholderTextColor="#666"
          style={styles.input}
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleSubmit}
        >
          <ThemedText style={styles.buttonText}>View Profile</ThemedText>
        </TouchableOpacity>

        {error && (
          <ThemedText style={styles.error}>{error}</ThemedText>
        )}
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
    padding: 16,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  button: {
    width: '100%',
    backgroundColor: '#001a4d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#001a4d',
  },
  error: {
    color: '#ff6b6b',
    marginTop: 16,
    textAlign: 'center',
  },
});