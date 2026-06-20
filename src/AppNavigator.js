import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FeedScreen from './screens/FeedScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import RecipeEditScreen from './screens/RecipeEditScreen';

const Stack = createNativeStackNavigator();

/**
 * Root navigation component.
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '700', color: '#1a1a1a' },
          headerTintColor: '#1a73e8',
          contentStyle: { backgroundColor: '#f5f7fa' },
        }}
      >
        <Stack.Screen
          name="Feed"
          component={FeedScreen}
          options={{ title: 'Reciprocity 🍳' }}
        />
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{ title: 'Recipe' }}
        />
        <Stack.Screen
          name="RecipeEdit"
          component={RecipeEditScreen}
          options={{ title: 'New Recipe' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
