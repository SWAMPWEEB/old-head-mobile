import React, { useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { useQuery } from 'react-query';
import { supabase } from '../supabaseClient';

/**
 * Fetch groups that the current user belongs to.  The RLS policies in
 * Supabase should ensure that only groups the user has access to are
 * returned.  Errors will be propagated through react‑query.
 */
const fetchGroups = async () => {
  const { data, error } = await supabase.from('groups').select('*');
  if (error) throw error;
  return data;
};

/**
 * Screen for listing and joining groups.  Users can enter an invite code
 * to submit a join request via a Supabase Function.  This screen should
 * be expanded to include an admin dashboard for approving requests.
 */
export default function GroupScreen() {
  const { data: groups, error, isLoading } = useQuery('groups', fetchGroups);
  const [inviteCode, setInviteCode] = useState('');

  const joinGroup = async () => {
    if (!inviteCode.trim()) return;
    try {
      // Example of invoking a Supabase Edge Function for joining a group.
      // You must create the `join_group` function in your Supabase project.
      const { data, error } = await supabase.functions.invoke('join_group', {
        body: { inviteCode }
      });
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Requested', 'Join request sent.');
        setInviteCode('');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Groups</Text>
      {isLoading ? (
        <Text>Loading groups...</Text>
      ) : (
        <FlatList
          data={groups || []}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.groupItem}>
              <Text style={styles.groupName}>{item.name}</Text>
            </View>
          )}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Enter invite code"
        value={inviteCode}
        onChangeText={setInviteCode}
      />
      <Button title="Join Group" onPress={joinGroup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  groupItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  groupName: { fontSize: 18 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginVertical: 12
  }
});