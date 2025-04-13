import { StyleSheet, Image } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GitHubProfile } from '@/types/github-profile';
import { Alarm } from '@/types/alarm';

interface AlarmsListProps {
  setShowAlarmList: (showAlarmList: boolean) => void;
  alarms: Alarm[];
}

export default function AlarmsList({ setShowAlarmList, alarms }: AlarmsListProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ profile: string }>();
  const profile = params.profile ? JSON.parse(params.profile) as GitHubProfile : null;

  const handleSignOut = () => {
    router.replace('/');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedView style={styles.profileContainer}>
            <ThemedView style={styles.profileHeader}>
              <Image
                source={{ uri: profile?.user.avatar_url }}
                style={styles.avatar}
              />
              <ThemedView style={styles.profileInfo}>
                <ThemedText type="subtitle">
                  {profile?.user.name || profile?.user.login}
                </ThemedText>
                <ThemedText style={styles.username}>
                  @{profile?.user.login}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            
            <ThemedView style={styles.statsContainer}>
              <ThemedView style={styles.statItem}>
                <ThemedText type="defaultSemiBold">
                  {profile?.user.followers}
                </ThemedText>
                <ThemedText>Followers</ThemedText>
              </ThemedView>
              <ThemedView style={styles.statItem}>
                <ThemedText type="defaultSemiBold">
                  {profile?.user.following}
                </ThemedText>
                <ThemedText>Following</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedText type="title" style={styles.alarmsTitle}>
          Your Alarms
        </ThemedText>

        {/* Existing alarms list */}
        {alarms.map(alarm => (
          <ThemedView key={alarm.id} style={styles.alarmCard}>
            <ThemedView style={styles.alarmHeader}>
              <ThemedView style={styles.timeContainer}>
                <ThemedText type="title" style={styles.timeText}>
                  {alarm.time}
                </ThemedText>
                <ThemedText style={styles.labelText}>
                  {alarm.label}
                </ThemedText>
              </ThemedView>
              <TouchableOpacity 
                style={[
                  styles.activeIndicator, 
                  alarm.isActive ? styles.activeOn : styles.activeOff
                ]}
              >
                <ThemedText style={styles.activeText}>
                  {alarm.isActive ? 'ON' : 'OFF'}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {alarm.daysActive.length > 0 && (
              <ThemedView style={styles.sectionContainer}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Repeats on
                </ThemedText>
                <ThemedView style={styles.daysContainer}>
                  {alarm.daysActive.map((day, index) => (
                    <ThemedText key={day} style={styles.dayChip}>
                      {day}
                    </ThemedText>
                  ))}
                </ThemedView>
              </ThemedView>
            )}

            {alarm.topics.length > 0 && (
              <ThemedView style={styles.sectionContainer}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                  Topics
                </ThemedText>
                <ThemedView style={styles.topicsContainer}>
                  {alarm.topics.map((topic, index) => (
                    <ThemedText key={topic} style={styles.topicChip}>
                      {topic}
                    </ThemedText>
                  ))}
                </ThemedView>
              </ThemedView>
            )}
          </ThemedView>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          setShowAlarmList(false);
        }}
      >
        <ThemedText style={styles.addButtonText}>+ Add Alarm</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  profileContainer: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  alarmsTitle: {
    marginBottom: 16,
  },
  signOutButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  signOutText: {
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alarmCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flex: 1,
  },
  timeText: {
    fontSize: 24,
    marginBottom: 4,
  },
  labelText: {
    color: '#666',
    fontSize: 14,
  },
  activeIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  activeOn: {
    backgroundColor: '#4CD964',
  },
  activeOff: {
    backgroundColor: '#FF3B30',
  },
  activeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  dayChip: {
    backgroundColor: 'rgba(0,122,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    fontSize: 12,
    color: '#007AFF',
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  topicChip: {
    backgroundColor: 'rgba(88,86,214,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    fontSize: 12,
    color: '#5856D6',
  },
});