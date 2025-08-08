import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

/**
 * Chat screen that provides an interface to converse with the GPT‑4o model.
 * Messages are held in local component state; a call to the OpenAI API
 * is made whenever the user sends a new message.  The API key must be
 * provided via the OPENAI_API_KEY environment variable.
 */
export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'welcome', from: 'ai', text: 'Hi! Ask me anything about fishing or hunting.' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now().toString(), from: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
      const extra =
        (Constants?.expoConfig && Constants.expoConfig.extra) ||
        (Constants?.manifest && Constants.manifest.extra) || {};
      const openAiKey =
        extra.OPENAI_API_KEY ||
        process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
        process.env.OPENAI_API_KEY;
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are an outdoor trip planner and conditions expert. Provide helpful, concise advice.' },
            ...messages.map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
            { role: 'user', content: userMessage.text }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`
          }
        }
      );
      const aiText = response.data.choices[0].message.content;
      const aiMessage = { id: `${Date.now()}_ai`, from: 'ai', text: aiText.trim() };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = err?.response?.data?.error?.message || err.message || 'Something went wrong.';
      const aiMessage = { id: `${Date.now()}_ai`, from: 'ai', text: `Error: ${errorMessage}` };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.from === 'user' ? styles.user : styles.ai]}>
            <Text>{item.text}</Text>
          </View>
        )}
        style={styles.list}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask a question..."
          value={input}
          onChangeText={setInput}
          multiline
        />
        <Button title={loading ? '...' : 'Send'} onPress={sendMessage} disabled={loading || !input.trim()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8 },
  list: { flex: 1 },
  message: { padding: 10, marginVertical: 4, borderRadius: 8, maxWidth: '80%' },
  user: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  ai: { backgroundColor: '#ECECEC', alignSelf: 'flex-start' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 4
  },
  input: { flex: 1, padding: 8, minHeight: 40 }
});