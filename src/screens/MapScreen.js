import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

/**
 * Map screen placeholder for the Expo Go client.  The original version of
 * Old Head relied on the Mapbox React Native SDK, which is not available
 * inside the managed Expo environment.  To keep the app runnable in Expo
 * Go, this component renders a simple view with instructions.  In a
 * production build you can replace this with `react-native-maps` or
 * migrate to the bare workflow to integrate Mapbox directly.
 */
export default function MapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Map placeholder</Text>
        <Text style={styles.instructions}>Map functionality is disabled in Expo Go. Install a supported map library or eject to bare workflow to enable full maps.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  placeholder: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center'
  },
  placeholderText: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  instructions: { textAlign: 'center' }
});