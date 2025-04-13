import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { StyleSheet, TouchableOpacity, View, Modal, Platform, Animated, ScrollView, TextInput } from 'react-native';
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
  const [alarmTime, setAlarmTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [tempAlarmTime, setTempAlarmTime] = useState(new Date());
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showDays, setShowDays] = useState(false);
  const [selectedDays, setSelectedDays] = useState<{[key: string]: boolean}>({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false
  });
  const [showTopics, setShowTopics] = useState(false);
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
  const [alarmLabel, setAlarmLabel] = useState('');

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      if (alarmTime && now >= alarmTime && !isAlarmActive) {
        setIsAlarmActive(true);
        playAlarmSound();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [alarmTime, isAlarmActive]);

  async function playAlarmSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/alarm.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      setSound(sound);
    } catch (error) {
      console.error('Error playing alarm sound:', error);
    }
  }

  const stopAlarm = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setIsAlarmActive(false);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setTempAlarmTime(selectedTime);
    }
  };

  const confirmAlarmTime = () => {
    const now = new Date();
    const alarm = new Date(now);
    alarm.setHours(tempAlarmTime.getHours());
    alarm.setMinutes(tempAlarmTime.getMinutes());
    alarm.setSeconds(0);
    
    if (alarm <= now) {
      alarm.setDate(alarm.getDate() + 1);
    }

    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: alarm.toLocaleTimeString(),
      label: alarmLabel || 'Alarm',
      isActive: true,
      daysActive: Object.keys(selectedDays).filter(day => selectedDays[day]),
      topics: Object.keys(selectedTopics).filter(topic => selectedTopics[topic])
    }
    console.log('newAlarm', newAlarm);

    setAlarmTime(alarm);
    setShowTimePicker(false);
    setShowAlarmList(true);
    setAlarms(prevAlarms => [...prevAlarms, newAlarm]);
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

  const formatAlarmTime = () => {
    if (!alarmTime) return '';
    const selectedDaysList = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => day);
    
    if (selectedDaysList.length === 0) {
      return `${alarmTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (No days selected)`;
    }
    
    return `${alarmTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${selectedDaysList.join(', ')})`;
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

        {alarmTime && (
          <View style={styles.alarmInfo}>
            <ThemedText style={styles.alarmText}>
              Alarm set for: {formatAlarmTime()}
            </ThemedText>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {isAlarmActive ? (
            <TouchableOpacity 
              style={[styles.button, styles.stopButton]}
              onPress={stopAlarm}
            >
              <ThemedText style={styles.buttonText}>Stop Alarm</ThemedText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.button}
              onPress={() => setShowTimePicker(true)}
            >
              <ThemedText style={styles.buttonText}>
                {alarmTime ? 'Change Alarm' : 'Set Alarm'}
              </ThemedText>
            </TouchableOpacity>
          )}
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
                placeholder="Enter alarm label"
                placeholderTextColor="#666"
                style={styles.labelInput}
              />
              <DateTimePicker
                value={tempAlarmTime}
                mode="time"
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                textColor="#ffffff"
                themeVariant="dark"
              />
              
              <TouchableOpacity 
                style={styles.dropdownHeader}
                onPress={() => {
                  setShowDays(!showDays);
                  if (!showDays) setShowTopics(false);
                }}
              >
                <ThemedText style={styles.daysTitle}>Repeat on</ThemedText>
                <Ionicons 
                  name={showDays ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#ffffff" 
                />
              </TouchableOpacity>

              {showDays && (
                <View style={styles.daysContainer}>
                  <ScrollView style={styles.scrollView}>
                    {Object.keys(selectedDays).map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.dayRow,
                          selectedDays[day] && styles.selectedDayRow
                        ]}
                        onPress={() => toggleDay(day)}
                        activeOpacity={0.7}
                      >
                        <Checkbox
                          status={selectedDays[day] ? 'checked' : 'unchecked'}
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
                          selectedDays[day] && styles.selectedDayText
                        ]}>
                          {day}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <TouchableOpacity 
                style={styles.dropdownHeader}
                onPress={() => {
                  setShowTopics(!showTopics);
                  if (!showTopics) setShowDays(false);
                }}
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
                  onPress={confirmAlarmTime}
                >
                  <ThemedText style={styles.modalButtonText}>Set Alarm</ThemedText>
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
  alarmInfo: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    padding: 10,
    borderRadius: 15,
    marginBottom: 20,
  },
  alarmText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
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
  stopButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.7)',
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
});