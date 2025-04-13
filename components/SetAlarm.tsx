import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { StyleSheet, TouchableOpacity, View, Modal, Platform, Animated, ScrollView, TextInput, ToastAndroid, Alert } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import SpaceBackground from './SpaceBackground';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Audio } from 'expo-av';
import { Checkbox } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Alarm } from '@/types/alarm';

interface SetAlarmProps {
  setShowAlarmList: (showAlarmList: boolean) => void;
  setAlarms: Dispatch<SetStateAction<Alarm[]>>
}

export default function SetAlarm({ setShowAlarmList, setAlarms }: SetAlarmProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [countdownMinutes, setCountdownMinutes] = useState('');
  const [countdownSeconds, setCountdownSeconds] = useState('');
  const [alarmLabel, setAlarmLabel] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<{[key: string]: boolean}>({
    'Arrays & Strings': false,
    'Linked Lists': false,
    'Stacks & Queues': false,
    'Trees & Graphs': false,
    'Dynamic Programming': false,
    'Sorting & Searching': false,
    'Recursion': false,
    'Bit Manipulation': false,
    'Greedy Algorithms': false,
    'Backtracking': false
  });
  const [showTopics, setShowTopics] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const setupCountdownTimer = () => {
    const minutes = parseInt(countdownMinutes) || 0;
    const seconds = parseInt(countdownSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;
    
    if (totalSeconds <= 0) {
      Platform.OS === 'android' 
        ? ToastAndroid.show('Please enter a valid time', ToastAndroid.SHORT)
        : Alert.alert('Invalid Time', 'Please enter a valid time');
      return;
    }

    const now = new Date();
    const endTime = now.getTime() + totalSeconds * 1000;

    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: new Date(endTime).toLocaleTimeString(),
      label: alarmLabel || 'Countdown Timer',
      isActive: true,
      daysActive: [],
      topics: Object.keys(selectedTopics).filter(topic => selectedTopics[topic]),
      countdownSeconds: totalSeconds,
      countdownEndTime: endTime
    };

    setAlarms(prevAlarms => [...prevAlarms, newAlarm]);
    setShowTimePicker(false);
    setShowAlarmList(true);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

  return (
    <View style={styles.container}>
      <SpaceBackground />
      <View style={styles.content}>
        <View style={styles.clockContainer}>
          <ThemedText style={styles.time}>
            {currentTime.toLocaleTimeString()}
          </ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setShowTimePicker(true)}
          >
            <ThemedText style={styles.buttonText}>
              Set Countdown Timer
            </ThemedText>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TextInput
                value={alarmLabel}
                onChangeText={setAlarmLabel}
                placeholder="Enter timer label"
                placeholderTextColor="#666"
                style={styles.labelInput}
              />
              
              <View style={styles.countdownContainer}>
                <TextInput
                  style={styles.countdownInput}
                  value={countdownMinutes}
                  onChangeText={setCountdownMinutes}
                  placeholder="Minutes"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
                <ThemedText style={styles.countdownSeparator}>:</ThemedText>
                <TextInput
                  style={styles.countdownInput}
                  value={countdownSeconds}
                  onChangeText={setCountdownSeconds}
                  placeholder="Seconds"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity 
                style={styles.dropdownHeader}
                onPress={() => setShowTopics(!showTopics)}
              >
                <ThemedText style={styles.daysTitle}>Topics</ThemedText>
                <Ionicons 
                  name={showTopics ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#ffffff" 
                />
              </TouchableOpacity>

              {showTopics && (
                <View style={styles.daysContainer}>
                  <ScrollView style={styles.scrollView}>
                    {Object.keys(selectedTopics).map((topic) => (
                      <TouchableOpacity
                        key={topic}
                        style={[
                          styles.dayRow,
                          selectedTopics[topic] && styles.selectedDayRow
                        ]}
                        onPress={() => toggleTopic(topic)}
                        activeOpacity={0.7}
                      >
                        <Checkbox
                          status={selectedTopics[topic] ? 'checked' : 'unchecked'}
                          onPress={() => {}}
                          color="#ffffff"
                          uncheckedColor="#ffffff"
                          theme={{
                            colors: {
                              primary: '#ffffff',
                              onSurface: '#ffffff',
                              surface: 'transparent',
                              background: 'transparent',
                            }
                          }}
                        />
                        <ThemedText style={[
                          styles.dayText,
                          selectedTopics[topic] && styles.selectedDayText
                        ]}>
                          {topic}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowTimePicker(false)}
                >
                  <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={setupCountdownTimer}
                >
                  <ThemedText style={styles.modalButtonText}>
                    Start Countdown
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  clockContainer: {
    height: 80,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 25,
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    marginBottom: 20,
  },
  time: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, .5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(74, 144, 226, 0.7)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 20,
    padding: 20,
    paddingLeft: 40,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalButtons: {
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.7)',
  },
  confirmButton: {
    backgroundColor: 'rgba(52, 199, 89, 0.7)',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  daysTitle: {
    color: '#ffffff',
    fontSize: 16,
  },
  daysContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    maxHeight: 150,
  },
  scrollView: {
    width: '100%',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    height: 50,
  },
  dayText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10,
  },
  selectedDayRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  selectedDayText: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  labelInput: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  countdownInput: {
    width: 80,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  countdownSeparator: {
    fontSize: 24,
    color: '#fff',
    marginHorizontal: 10,
  },
});