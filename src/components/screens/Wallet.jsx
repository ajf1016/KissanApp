import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import axios from 'axios';
import {BASE_URL} from '../../../apiConfig';
import {UserContext} from '../context/stores/Userstore';

const Wallet = ({userId}) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const {userState} = useContext(UserContext);

  // Function to fetch wallet balance from API
  const fetchWalletBalance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(BASE_URL + 'market/wallet-balance/', {
        headers: {
          Authorization: `Bearer ${userState.access_token}`, // Include access token in the headers
        },
      });
      console.log(response.data.data[0].balance);
      setBalance(response.data.data[0].balance); // Assuming response contains a 'balance' field
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch balance.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletBalance(); // Fetch balance when component mounts
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet Balance</Text>
      <Text style={styles.balance}>₹{balance}</Text>
      <Button title="Refresh" onPress={fetchWalletBalance} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50', // Green color
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 20,
    color: '#999',
  },
});

export default Wallet;
