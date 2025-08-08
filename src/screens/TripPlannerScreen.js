import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

/**
 * Trip planner screen where users can select their hunting or fishing mode
 * and desired outing duration.  In the future this screen should invoke
 * the AI back‑end to generate a detailed itinerary and schedule.
 */
export default function TripPlannerScreen() {
  const [mode, setMode] = useState('Fishing');
  const [duration, setDuration] = useState('4h');

  const handlePlan = () => {
    // Placeholder for AI invocation.  Replace with call to your backend.
    alert(`Planning a ${duration} ${mode.toLowerCase()} trip...`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Trip Planner</Text>
      <Text style={styles.label}>Mode</Text>
      <Picker
        selectedValue={mode}
        onValueChange={setMode}
        style={styles.picker}
      >
        <Picker.Item label="Fishing" value="Fishing" />
        <Picker.Item label="Hunting" value="Hunting" />
      </Picker>
      <Text style={styles.label}>Duration</Text>
      <Picker
        selectedValue={duration}
        onValueChange={setDuration}
        style={styles.picker}
      >
        <Picker.Item label="2 hours" value="2h" />
        <Picker.Item label="4 hours" value="4h" />
        <Picker.Item label="All day" value="All-day" />
      </Picker>
      <Button title="Plan Trip" onPress={handlePlan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 18, marginTop: 16 },
  picker: { height: 50, width: '100%' }
});