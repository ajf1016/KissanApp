import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar, ActivityIndicator, View} from 'react-native';
import {
  SafeAreaInsetsContext,
  SafeAreaView,
} from 'react-native-safe-area-context';

// Screens

// User Context
import {UserContext} from '../context/stores/Userstore';
import TabNavigation from './TabNavigation';
import {COLORS} from '../../constants/theme';
import SignIn from '../auth/SignIn';
import Login from '../auth/Login';

const Stack = createNativeStackNavigator();

const AuthScreen = () => (
  <Stack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="Login">
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="Login" component={Login} />
  </Stack.Navigator>
);

const MainScreen = () => (
  <Stack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="TabNavigation">
    <Stack.Screen name="TabNavigation" component={TabNavigation} />
    {/* <Stack.Screen name="Dashboard" component={Dashboard} /> */}
  </Stack.Navigator>
);

export default function Navigation() {
  const {userDispatch, userState} = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const checkUserLogIn = async () => {
    try {
      let user_data = await AsyncStorage.getItem('user');

      if (user_data) {
        user_data = JSON.parse(user_data);

        userDispatch({
          type: 'UPDATE_USER',
          user: {
            is_verified:
              user_data.is_verified === true ||
              user_data.is_verified === 'true',
            access_token: user_data.access_token,
            is_farmer: user_data.is_farmer,
            phone: user_data.phone,
            name: user_data.name,
            user_id: user_data.user_id,
            // Add any other relevant user data here
          },
        });
      } else {
        userDispatch({
          type: 'UPDATE_USER',
          user: {is_verified: false},
        });
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserLogIn();
  }, []);

  // Loading indicator while checking auth state
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={COLORS.green} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      {userState.is_verified ? <MainScreen /> : <AuthScreen />}
    </NavigationContainer>
  );
}
