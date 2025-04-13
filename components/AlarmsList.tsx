import { StyleSheet, Image, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GitHubProfile } from '@/types/github-profile';
import { Alarm } from '@/types/alarm';
import SpaceBackground from './SpaceBackground';
import { LinearGradient } from 'expo-linear-gradient';

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
    <View style={styles.container}>
      <SpaceBackground />
      <LinearGradient
        colors={['#000000', '#001a4d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <View style={styles.profileContainer}>
                <View style={styles.profileHeader}>
                  <Image
                    source={{ uri: profile?.user.avatar_url }}
                    style={styles.avatar}
                  />
                  <View style={styles.profileInfo}>
                    <ThemedText type="subtitle">
                      {profile?.user.name || profile?.user.login}
                    </ThemedText>
                    <ThemedText style={styles.username}>
                      @{profile?.user.login}
                    </ThemedText>
                  </View>
                </View>
                
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <ThemedText type="defaultSemiBold">
                      {profile?.user.followers}
                    </ThemedText>
                    <ThemedText>Followers</ThemedText>
                  </View>
                  <View style={styles.statItem}>
                    <ThemedText type="defaultSemiBold">
                      {profile?.user.following}
                    </ThemedText>
                    <ThemedText>Following</ThemedText>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.signOutButton}
                onPress={handleSignOut}
              >
                <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedText type="title" style={styles.alarmsTitle}>
              Your Alarms
            </ThemedText>

            {/* Existing alarms list */}
            {alarms.map(alarm => (
              <View key={alarm.id} style={styles.alarmCard}>
                <View style={styles.alarmHeader}>
                  <View style={styles.timeContainer}>
                    <ThemedText type="title" style={styles.timeText}>
                      {alarm.time}
                    </ThemedText>
                    <ThemedText style={styles.labelText}>
                      {alarm.label}
                    </ThemedText>
                  </View>
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
                </View>

                {alarm.daysActive.length > 0 && (
                  <View style={styles.sectionContainer}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                      Repeats on
                    </ThemedText>
                    <View style={styles.daysContainer}>
                      {alarm.daysActive.map((day, index) => (
                        <ThemedText key={day} style={styles.dayChip}>
                          {day}
                        </ThemedText>
                      ))}
                    </View>
                  </View>
                )}

                {alarm.topics.length > 0 && (
                  <View style={styles.sectionContainer}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                      Topics
                    </ThemedText>
                    <View style={styles.topicsContainer}>
                      {alarm.topics.map((topic, index) => (
                        <ThemedText key={topic} style={styles.topicChip}>
                          {topic}
                        </ThemedText>
                      ))}
                    </View>
                  </View>
                )}
              </View>
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
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginTop: 40,
    marginBottom: 24,
    color: 'white',
  },
  profileContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#001a4d',
    color: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#001a4d',
    color: 'white',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    backgroundColor: '#001a4d',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
    backgroundColor: '#001a4d',
    color: 'white',
  },
  username: {
    backgroundColor: '#001a4d',
    color: 'white',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#001a4d',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#001a4d',
    color: 'white',
  },
  alarmsTitle: {
    marginBottom: 16,
    color: 'white',
  },
  alarmsTitleText: {
    color: '#ccc',
  },
  signOutButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
    color: 'white',
  },
  signOutText: {
    color: 'white',
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
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
    backgroundColor: '#001a4d',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    color: 'white',
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#001a4d',
    color: 'white',
  },
  timeContainer: {
    flex: 1,
    backgroundColor: '#001a4d',
    color: 'white',
  },
  timeText: {
    fontSize: 24,
    marginBottom: 4,
    backgroundColor: '#001a4d',
    color: 'white',
  },
  labelText: {
    color: 'white',
    fontSize: 14,
    backgroundColor: '#001a4d',
  },
  activeIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
    backgroundColor: '#001a4d',
    color: 'white',
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
    backgroundColor: '#001a4d',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    backgroundColor: '#001a4d',
    color: 'white',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    backgroundColor: '#001a4d',
    color: 'white',
  },
  dayChip: {
    backgroundColor: '#001a4d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    fontSize: 12,
    color: 'white',
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    backgroundColor: '#001a4d',
    color: 'white',
  },
  topicChip: {
    backgroundColor: '#001a4d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    fontSize: 12,
    color: 'white',
  },
});