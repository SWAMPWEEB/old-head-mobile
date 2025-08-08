import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';

/**
 * Fetch simulated AI suggestions.  In a production app this would call
 * your OpenAI integration or another backend function to return helpful
 * tips based on weather, water conditions and species patterns.
 */
const fetchSuggestions = async () => {
  // Hard‑coded sample suggestions; replace with your own integration.
  return [
    {
      id: 1,
      message: 'Ideal fishing times tomorrow in Atchafalaya: early morning and dusk.'
    },
    {
      id: 2,
      message: 'High water levels expected; plan your route accordingly.'
    }
  ];
};

/**
 * Dashboard screen showing AI suggestions and saved locations.  This screen
 * serves as the start screen for authenticated users.  It uses react‑query
 * to cache the suggestions data.
 */
export default function DashboardScreen() {
  const { data: suggestions, isLoading } = useQuery('suggestions', fetchSuggestions);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>
      <Text style={styles.subheading}>AI Suggestions</Text>
      {isLoading ? (
        <Text>Loading suggestions...</Text>
      ) : (
        suggestions.map(item => (
          <Text key={item.id.toString()} style={styles.suggestion}>
            • {item.message}
          </Text>
        ))
      )}
      <Text style={styles.subheading}>Saved Locations</Text>
      <Text>No saved locations yet. Drop pins on the map to save your favorite spots!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  subheading: { fontSize: 20, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  suggestion: { fontSize: 16, marginBottom: 4 }
});