import React, {useContext, useState} from 'react';
import {
  View,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {LinearGradient} from 'react-native-linear-gradient';
import {UserContext} from '../context/stores/Userstore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL} from '../../../apiConfig';

const CircularLogo = () => (
  <Image
    source={require('../../assets/images/kissan-logo.jpeg')}
    style={styles.logo}
  />
);

const WelcomeText = () => (
  <View style={styles.welcomeTextContainer}>
    <LinearGradient
      colors={['#FF9933', '#FFFFFF', '#138808']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.gradientTextContainer}>
      <Text style={styles.welcomeText}>Welcome Onboard</Text>
    </LinearGradient>
  </View>
);

const TopWave = () => (
  <View style={styles.topWaveContainer}>
    <Svg width="150" height="80" viewBox="0 0 150 80" style={styles.wave}>
      <Path
        d="M0,30 C30,10 60,20 90,30 C120,40 150,20 150,30 L150,0 L0,0 Z"
        fill="#FF9933" // Indian saffron color
      />
    </Svg>
  </View>
);

const BottomWave = () => (
  <View style={styles.bottomWaveContainer}>
    <Svg width="150" height="80" viewBox="0 0 150 80" style={styles.wave}>
      <Path
        d="M0,50 C30,70 60,60 90,50 C120,40 150,60 150,50 L150,80 L0,80 Z"
        fill="#28A745" // Green color
      />
    </Svg>
  </View>
);

const Login = () => {
  let navigation = useNavigation();
  const {userDispatch, userState} = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Create user data object with username and password
    const loginData = {
      username: username,
      password: password,
    };

    try {
      // Send a POST request to the login API
      const response = await fetch(BASE_URL + 'user_auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      // Check if the response is okay
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      // Parse the response JSON
      const data = await response.json();

      // Assuming the API returns user information and a token
      let user_data = {
        ...data.user, // Adjust according to your API response structure
        is_verified: true,
        access_token: data.access,
        is_farmer: data.is_farmer,
        phone: data.phone,
        name: data.name,
        user_id: data.user_id,
      };

      // Save user data to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user_data));

      // Dispatch the user data to the context
      userDispatch({
        type: 'UPDATE_USER',
        user: {
          user: true,
          ...user_data,
        },
      });
    } catch (error) {
      console.error('Login error:', error.message);
      // You can also handle error UI here (e.g., show an alert or toast)
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TopWave />
      <WelcomeText />
      <CircularLogo />
      <View style={styles.form}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#666" // Light gray color for the placeholder
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#666" // Light gray color for the placeholder
          style={styles.input}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={styles.footerText}
        onPress={() => navigation.navigate('SignIn')}>
        Don't Have Account?<Text style={styles.signup}> Sign Up</Text>
      </Text>
      <BottomWave />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden', // Ensures the wave doesn't overflow
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 20,
  },
  form: {
    width: '80%',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    color: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16, // Ensure text inside the input is visible and matches placeholder
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  topWaveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 150,
    height: 80,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  bottomWaveContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 150,
    height: 80,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  welcomeTextContainer: {
    position: 'absolute',
    top: 120, // Adjust this value to position text just above the logo
    alignItems: 'center',
  },
  gradientTextContainer: {
    padding: 10,
    borderRadius: 5,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // Ensure the text is visible over the gradient
  },
  footerText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 10,
  },
  signup: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default Login;
