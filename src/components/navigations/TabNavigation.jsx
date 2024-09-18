import React, {useContext} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS, SIZES} from '../../constants/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import Home from '../screens/Home';
import {UserContext} from '../context/stores/Userstore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuctionScreen from '../screens/AuctionScreen';
import {useNavigation} from '@react-navigation/native';
import Wallet from '../screens/Wallet';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Sample screen components for different features
const TrackMe = () => <View style={styles.screenContainer} />;
const Report = () => <View style={styles.screenContainer} />;
const Contacts = () => <View style={styles.screenContainer} />;
const SafeZonesScreen = () => <View style={styles.screenContainer} />;

const HomeNavigator = () => (
  <Stack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName={'Home'}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="AuctionScreen" component={AuctionScreen} />
    <Stack.Screen name="Wallet" component={Wallet} />
  </Stack.Navigator>
);

const HeaderRight = ({handleLogout, userState}) => {
  let navigation = useNavigation();
  return (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.headerButton}>
        <Icon name="notifications" size={24} color={COLORS.green} />
      </TouchableOpacity>
      {!userState.is_farmer && (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Wallet')}>
          <Icon name="wallet" size={24} color={COLORS.green} />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
        <Icon name="log-out" size={24} color={COLORS.red} />
      </TouchableOpacity>
    </View>
  );
};

const HeaderLeft = () => (
  <TouchableOpacity style={styles.headerRight}>
    <Image
      source={require('../../assets/images/kissan-logo.jpeg')}
      style={styles.image}
      resizeMode="contain"
    />
  </TouchableOpacity>
);

const CustomHeader = ({handleLogout, userState}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginBottom: Platform.OS == 'ios' ? SIZES.wp('11%') : SIZES.wp('19%'),
      }}>
      <View
        style={{
          height: SIZES.wp('20%'),
          // paddingVertical: SIZES.wp('5%'),
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: COLORS.background,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <HeaderLeft />
        <HeaderRight handleLogout={handleLogout} userState={userState} />
      </View>
    </SafeAreaView>
  );
};

const TabNavigation = () => {
  const {userDispatch, userState} = useContext(UserContext);
  let navigation = useNavigation();
  const handleLogout = async () => {
    // Remove the access token from AsyncStorage
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {}

    // Dispatch the user state update to log the user out
    userDispatch({
      type: 'UPDATE_USER',
      user: {
        user: false,
        is_verified: false,
      },
    });
  };
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: 'gray',
        header: () => (
          <CustomHeader
            handleLogout={handleLogout}
            userState={userState}
            navigation={navigation}
          />
        ),
        showLabel: Platform.OS == 'ios' ? false : true,
        tabBarLabelStyle: {
          fontSize: SIZES.wp('3%'), // Adjust font size if needed
          paddingBottom: SIZES.wp('3%'), // Adds space below the label to avoid congestion
        },
        tabBarStyle: {
          height: Platform.OS == 'ios' ? SIZES.wp('25%') : SIZES.wp('20%'), // Adjust this to increase the tab bar height
          paddingVertical: SIZES.wp('2%'), // Adjust padding to space things out vertically
          backgroundColor: COLORS.background,
        },
      })}>
      <Tab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="TrackMe"
        component={TrackMe}
        options={{
          tabBarLabel: 'Track Me',
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="my-location" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={Report}
        options={{
          tabBarLabel: 'Report',
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="report-problem" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SafeZones"
        component={SafeZonesScreen}
        options={{
          tabBarLabel: 'Safe Zones',
          tabBarIcon: ({color, size}) => (
            <Icon name="shield-checkmark" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="contact-page" color={color} size={size} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: 10,
  },
  headerRight: {
    flexDirection: 'row',
  },
  image: {
    width: SIZES.wp('20%'),
    height: SIZES.wp('20%'),
  },
});

export default TabNavigation;
