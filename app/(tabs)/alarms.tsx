import { useState } from 'react';
import { View } from 'react-native';
import SetAlarm from '@/components/SetAlarm';
import AlarmsList from '@/components/AlarmsList';
import { Alarm } from '@/types/alarm';

export default function AlarmsScreen() {
  const [showAlarmList, setShowAlarmList] = useState(true);
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  return (
    <View style={{ flex: 1 }}>
      {showAlarmList ? (
        <AlarmsList
          setShowAlarmList={setShowAlarmList}
          alarms={alarms}
          setAlarms={setAlarms}
        />
      ) : (
        <SetAlarm
          setShowAlarmList={setShowAlarmList}
          setAlarms={setAlarms}
        />
      )}
    </View>
  );
}
