import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useRouter } from 'expo-router';

interface CountdownTimerProps {
  endTime: number;
  onComplete: () => void;
  selectedTopics: string[];
}

export default function CountdownTimer({ endTime, onComplete, selectedTopics }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft('00:00');
        onComplete();
        // Navigate to questions page with selected topics
        router.push({
          pathname: '/questions',
          params: { topics: selectedTopics.join(',') }
        });
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.timeText}>{timeLeft}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});