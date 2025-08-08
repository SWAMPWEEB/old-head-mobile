import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import DashboardScreen from '../screens/DashboardScreen';
import MapScreen from '../screens/MapScreen';
import ChatScreen from '../screens/ChatScreen';
import TripPlannerScreen from '../screens/TripPlannerScreen';
import GroupScreen from '../screens/GroupScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Bottom tab navigator containing the primary application screens.  Each tab
 * corresponds to a major piece of functionality in the Old Head app.
 */
function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="TripPlanner" component={TripPlannerScreen} options={{ title: 'Trip Planner' }} />
      <Tab.Screen name="Groups" component={GroupScreen} />
    </Tab.Navigator>
  );
}

/**
 * Root navigator selects either the authenticated application or the login
 * screen depending on whether the user is signed in.  While the auth
 * status is unknown a loading indicator is displayed.
 */
export default function RootNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App" component={AppTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}