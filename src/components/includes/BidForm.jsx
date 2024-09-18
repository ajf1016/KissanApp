// src/components/BidForm.js
import React, {useContext, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewBase,
} from 'react-native';
import axios from 'axios';
import {db} from '../../../firebaseConfig'; // Import your Firebase configuration
import {ref, set} from 'firebase/database';
import {BASE_URL} from '../../../apiConfig';
import {UserContext} from '../context/stores/Userstore';
import {COLORS} from '../../constants/theme';

const BidForm = ({auctionId, buyer, crop, price, quantity, variety}) => {
  const [bidAmount, setBidAmount] = useState('');
  const [bidQty, setBidQty] = useState('');
  const {userDispatch, userState} = useContext(UserContext);

  const handleSubmit = async () => {
    if (bidAmount && bidQty) {
      try {
        // First, submit the bid to the Django backend
        const response = await axios.post(
          BASE_URL + 'market/submit-bid/',
          {
            auction_id: auctionId,
            bid_amount: bidAmount,
            bid_quantity: bidQty,
            created_at: new Date().toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${userState.access_token}`,
            },
          },
        );

        // If the bid submission is successful, save it to Firebase
        const newBidRef = ref(db, `auction/${buyer}/${response.data.bid.id}`); // Assuming response.data.bid.id is the ID of the bid
        await set(newBidRef, {
          bidder_name: response.data.bid.bidder_name, // Replace with the actual bidder's name
          bid_amount: response.data.bid.bid_amount, // Adjusted to use bid_amount
          quantity: bidQty,
          created_at: new Date().toISOString(),
        });

        Alert.alert('Success', response.data.message);
        setBidAmount(''); // Reset the input field
      } catch (error) {
        console.error(error);
        Alert.alert(
          'Error',
          'Error submitting bid: ' + error.response.data.message,
        );
      }
    } else {
      Alert.alert('Warning', 'Pls Enter all the values');
    }
  };

  return userState.is_farmer ? (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={bidAmount}
          onChangeText={setBidAmount}
          placeholder="Enter your bid amount"
          required
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={bidQty}
          onChangeText={setBidQty}
          placeholder="Enter your bid Quantity"
          required
        />
      </View>
      {/* <Button title="Submit Bid" onPress={handleSubmit} style={styles.button} /> */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.orderButtonText}>Submit Bid</Text>
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    // padding: 16,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '49%',
    fontWeight: '500',
    fontSize: 13,
  },
  button: {
    backgroundColor: COLORS.green,
    color: 'white',
    padding: 10,
    borderRadius: 5,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BidForm;
