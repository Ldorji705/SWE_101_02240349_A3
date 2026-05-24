import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import useBookStore from './store/useBookStore';

import LoginScreen from './screens/LoginScreen';
import BookListScreen from './screens/BookListScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import CreateBookScreen from './screens/CreateBookScreen';
import EditBookScreen from './screens/EditBookScreen';

const Stack = createStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);
  const { rehydrate, authToken } = useBookStore();

  useEffect(() => {
    rehydrate().then(() => setReady(true));
  }, []);

  if (!ready) return null; // or a splash screen

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!authToken ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="BookList" component={BookListScreen} options={{ title: 'My Library' }} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Book Detail' }} />
            <Stack.Screen name="CreateBook" component={CreateBookScreen} options={{ title: 'Add Book' }} />
            <Stack.Screen name="EditBook" component={EditBookScreen} options={{ title: 'Edit Book' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}