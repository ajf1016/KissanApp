// import React, {useContext, useState} from 'react';
// import {
//   View,
//   StatusBar,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Alert,
//   ScrollView,
// } from 'react-native';
// import Svg, {Path} from 'react-native-svg';
// import {LinearGradient} from 'react-native-linear-gradient';
// import {COLORS} from '../../constants/theme';
// import {useNavigation} from '@react-navigation/native';
// import {UserContext} from '../context/stores/Userstore';
// import {BASE_URL} from '../../../apiConfig';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const WelcomeText = () => (
//   <View style={styles.welcomeTextContainer}>
//     <LinearGradient
//       colors={['#FF9933', '#FFFFFF', '#138808']}
//       start={{x: 0, y: 0}}
//       end={{x: 1, y: 1}}
//       style={styles.gradientTextContainer}>
//       <Text style={styles.welcomeText}>Sign In</Text>
//     </LinearGradient>
//   </View>
// );

// const TopWave = () => (
//   <View style={styles.topWaveContainer}>
//     <Svg width="150" height="80" viewBox="0 0 150 80" style={styles.wave}>
//       <Path
//         d="M0,30 C30,10 60,20 90,30 C120,40 150,20 150,30 L150,0 L0,0 Z"
//         fill="#FF9933"
//       />
//     </Svg>
//   </View>
// );

// const BottomWave = () => (
//   <View style={styles.bottomWaveContainer}>
//     <Svg width="150" height="80" viewBox="0 0 150 80" style={styles.wave}>
//       <Path
//         d="M0,50 C30,70 60,60 90,50 C120,40 150,60 150,50 L150,80 L0,80 Z"
//         fill="#28A745"
//       />
//     </Svg>
//   </View>
// );

// const SignInForm = ({formType}) => {
//   const {userDispatch} = useContext(UserContext);

//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [aadhaarNumber, setAadhaarNumber] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [gstNumber, setGstNumber] = useState('');
//   const [organization, setOrganization] = useState('');
//   const [acreOfLand, setAcreOfLand] = useState('');
//   const [kisanCard, setKisanCard] = useState('');
//   const [isFarmer, setIsFarmer] = useState(true); // Add toggle for farmer or buyer

//   const handleSignIn = async () => {
//     // Validation logic
//     const aadhaarRegex = /^\d{3}$/;
//     const phoneNumberRegex = /^\d{10}$/;

//     if (
//       !username ||
//       !email ||
//       !password ||
//       !aadhaarNumber ||
//       !phoneNumber ||
//       !address
//     ) {
//       Alert.alert('Validation Error', 'Please fill in all required fields.');
//       return;
//     }

//     if (!aadhaarRegex.test(aadhaarNumber)) {
//       Alert.alert(
//         'Validation Error',
//         'Aadhaar number must be exactly 12 digits.',
//       );
//       return;
//     }

//     if (!phoneNumberRegex.test(phoneNumber)) {
//       Alert.alert(
//         'Validation Error',
//         'Phone number must be exactly 10 digits.',
//       );
//       return;
//     }

//     // Prepare the data for farmers and buyers
//     const userData = {
//       username,
//       email,
//       password,
//       adharcard: aadhaarNumber,
//       phone: phoneNumber,
//       address,
//       ...(isFarmer
//         ? {is_farmer: true, acre_of_land: acreOfLand, kisan_card: kisanCard}
//         : {is_buyer: true, gst: gstNumber, organization}),
//     };

//     try {
//       const response = await fetch(BASE_URL + 'user_auth/register/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Store access token or relevant user data if needed
//         await AsyncStorage.setItem('user', JSON.stringify(data));

//         // Dispatch user update to context
//         userDispatch({
//           type: 'UPDATE_USER',
//           user: {
//             ...data,
//             is_verified: true,
//           },
//         });

//         Alert.alert('Success', 'Registration successful!');
//       } else {
//         // Handle error response from server
//         Alert.alert('Error', data + 'hai' || 'Registration failed.');
//       }
//     } catch (error) {
//       console.error('Error during registration:', error);
//       Alert.alert('Error', 'Something went wrong during registration.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.formContainer}>
//       {formType === 'Farmer' ? (
//         <>
//           <TextInput
//             value={username}
//             onChangeText={setUsername}
//             placeholder="Username"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             placeholder="Email"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//             placeholder="Password"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={aadhaarNumber}
//             onChangeText={setAadhaarNumber}
//             keyboardType="numeric"
//             maxLength={12}
//             placeholder="Aadhaar Card Number"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={acreOfLand}
//             onChangeText={setAcreOfLand}
//             keyboardType="numeric"
//             placeholder="Acre of Land"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={kisanCard}
//             onChangeText={setKisanCard}
//             placeholder="Kisan Card Number"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={address}
//             onChangeText={setAddress}
//             placeholder="Address"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//             keyboardType="phone-pad"
//             maxLength={10}
//             placeholder="Phone Number"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//         </>
//       ) : (
//         <>
//           <TextInput
//             value={username}
//             onChangeText={setUsername}
//             placeholder="Username"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             placeholder="Email"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//             placeholder="Password"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={aadhaarNumber}
//             onChangeText={setAadhaarNumber}
//             keyboardType="numeric"
//             maxLength={12}
//             placeholder="Aadhaar Card Number"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//             keyboardType="phone-pad"
//             maxLength={10}
//             placeholder="Phone Number"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={address}
//             onChangeText={setAddress}
//             placeholder="Address"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={gstNumber}
//             onChangeText={setGstNumber}
//             placeholder="GST Number"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//           <TextInput
//             value={organization}
//             onChangeText={setOrganization}
//             placeholder="Organization"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//         </>
//       )}
//       <TouchableOpacity onPress={handleSignIn} style={styles.button}>
//         <Text style={styles.buttonText}>Get OTP For Verification</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const SignIn = () => {
//   const [formType, setFormType] = useState(null);
//   let navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <TopWave />
//       {/* Only show WelcomeText if no formType is selected */}
//       {!formType && <WelcomeText />}
//       {!formType ? (
//         <View style={styles.selectionContainer}>
//           <TouchableOpacity
//             onPress={() => setFormType('Farmer')}
//             style={styles.selectionButton}>
//             <Text style={styles.buttonText}>Farmer</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setFormType('Organization')}
//             style={styles.selectionButton}>
//             <Text style={styles.buttonText}>Buyer</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <SignInForm formType={formType} />
//       )}
//       {formType === null && (
//         <Text
//           style={styles.footerText}
//           onPress={() => navigation.navigate('Login')}>
//           Don't Have Account?<Text style={styles.signup}> Sign Up</Text>
//         </Text>
//       )}
//       <BottomWave />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     overflow: 'hidden',
//     paddingBottom: 20,
//   },
//   selectionContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginBottom: 20,
//   },
//   selectionButton: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 5,
//     width: '45%',
//     alignItems: 'center',
//   },
//   input: {
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   topWaveContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 150,
//     height: 80,
//     overflow: 'hidden',
//     backgroundColor: 'transparent',
//   },
//   bottomWaveContainer: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 150,
//     height: 80,
//     overflow: 'hidden',
//     backgroundColor: 'transparent',
//   },
//   wave: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//   },
//   welcomeTextContainer: {
//     position: 'absolute',
//     top: 120,
//     alignItems: 'center',
//   },
//   gradientTextContainer: {
//     padding: 10,
//     borderRadius: 5,
//   },
//   welcomeText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   formContainer: {
//     width: '100%',
//     justifyContent: 'center',
//     paddingVertical: 60, // Increased vertical padding
//     marginTop: 40, // Added top margin to push the form down
//   },
//   footerText: {
//     textAlign: 'center',
//     color: 'gray',
//     marginTop: 10,
//   },
//   signup: {
//     color: COLORS.green,
//     fontSize: 13,
//     fontWeight: 'bold',
//   },
// });

// export default SignIn;

import React, {useContext, useState} from 'react';
import {
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {LinearGradient} from 'react-native-linear-gradient';
import {COLORS} from '../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../context/stores/Userstore';
import {BASE_URL} from '../../../apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeText = () => (
  <View style={styles.welcomeTextContainer}>
    <LinearGradient
      colors={['#FF9933', '#FFFFFF', '#138808']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.gradientTextContainer}>
      <Text style={styles.welcomeText}>Sign In</Text>
    </LinearGradient>
  </View>
);

const SignInForm = ({isFarmer}) => {
  const {userDispatch} = useContext(UserContext);
  let navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [organization, setOrganization] = useState('');
  const [acreOfLand, setAcreOfLand] = useState('');
  const [kisanCard, setKisanCard] = useState('');

  const handleSignIn = async () => {
    // Validation logic
    const aadhaarRegex = /^\d{3}$/; // Aadhaar should be exactly 12 digits
    const phoneNumberRegex = /^\d{3}$/;

    if (
      !username ||
      !email ||
      !password ||
      !aadhaarNumber ||
      !phoneNumber ||
      !address
    ) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    if (!aadhaarRegex.test(aadhaarNumber)) {
      Alert.alert(
        'Validation Error',
        'Aadhaar number must be exactly 12 digits.',
      );
      return;
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
      Alert.alert(
        'Validation Error',
        'Phone number must be exactly 10 digits.',
      );
      return;
    }

    // Prepare the data for farmers and buyers
    const userData = {
      username,
      email,
      password,
      adharcard: aadhaarNumber,
      phone: phoneNumber,
      address,
      ...(isFarmer
        ? {is_farmer: true, acre_of_land: acreOfLand, kisan_card: kisanCard}
        : {is_buyer: true, gst: gstNumber, organization}),
    };

    console.log('USERDATA', userData);

    try {
      const response = await fetch(BASE_URL + 'user_auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store access token or relevant user data if needed
        // await AsyncStorage.setItem('user', JSON.stringify(data));

        // // Dispatch user update to context
        // userDispatch({
        //   type: 'UPDATE_USER',
        //   user: {
        //     ...data,
        //     is_verified: true,
        //     access_token: data.access,
        //   },
        // });

        Alert.alert('Success', 'Registration successful!, Login to continue');
        navigation.navigate('Login');
      } else {
        console.log(data);
        Alert.alert('Error', data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Something went wrong during registration.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        placeholderTextColor="#666"
        style={styles.input}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor="#666"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor="#666"
        style={styles.input}
      />
      <TextInput
        value={aadhaarNumber}
        onChangeText={setAadhaarNumber}
        keyboardType="numeric"
        maxLength={12}
        placeholder="Aadhaar Card Number"
        placeholderTextColor="#666"
        style={styles.input}
      />
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        maxLength={10}
        placeholder="Phone Number"
        placeholderTextColor="#666"
        style={styles.input}
      />
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        placeholderTextColor="#666"
        style={styles.input}
      />
      {isFarmer && (
        <>
          <TextInput
            value={acreOfLand}
            onChangeText={setAcreOfLand}
            keyboardType="numeric"
            placeholder="Acre of Land"
            placeholderTextColor="#666"
            style={styles.input}
          />
          <TextInput
            value={kisanCard}
            onChangeText={setKisanCard}
            placeholder="Kisan Card Number"
            placeholderTextColor="#666"
            style={styles.input}
          />
        </>
      )}
      {!isFarmer && (
        <>
          <TextInput
            value={gstNumber}
            onChangeText={setGstNumber}
            placeholder="GST Number"
            placeholderTextColor="#666"
            style={styles.input}
          />
          <TextInput
            value={organization}
            onChangeText={setOrganization}
            placeholder="Organization"
            placeholderTextColor="#666"
            style={styles.input}
          />
        </>
      )}
      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Get OTP For Verification</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const SignIn = () => {
  const [isFarmer, setIsFarmer] = useState(null); // Add toggle for farmer or buyer
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* <TopWave /> */}
      {/* Only show WelcomeText if no formType is selected */}
      {/* {!formType && <WelcomeText />} */}
      {isFarmer === null ? (
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            onPress={() => setIsFarmer(true)}
            style={styles.selectionButton}>
            <Text style={styles.buttonText}>Farmer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsFarmer(false)}
            style={styles.selectionButton}>
            <Text style={styles.buttonText}>Buyer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SignInForm isFarmer={isFarmer} />
      )}
      {isFarmer === null && (
        <Text
          style={styles.footerText}
          onPress={() => navigation.navigate('Login')}>
          Don't Have Account?<Text style={styles.signup}> Sign Up</Text>
        </Text>
      )}
      {/* <BottomWave /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  selectionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
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
  waveContainer: {
    position: 'absolute',
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
    top: 120,
    alignItems: 'center',
  },
  gradientTextContainer: {
    padding: 10,
    borderRadius: 5,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 60,
    marginTop: 40,
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

export default SignIn;
