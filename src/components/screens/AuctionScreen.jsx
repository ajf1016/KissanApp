// src/screens/AuctionScreen.js
import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {db} from '../../../firebaseConfig'; // Import your Firebase configuration
import {ref, onValue} from 'firebase/database';
import BidForm from '../includes/BidForm';
import {UserContext} from '../context/stores/Userstore';
import {COLORS} from '../../constants/theme';
import axios from 'axios';
import {BASE_URL} from '../../../apiConfig';

const AuctionScreen = ({route}) => {
  const {userState} = useContext(UserContext);
  const {auctionId, buyer, crop, price, quantity, variety} = route.params;

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef(null);

  useEffect(() => {
    const bidsRef = ref(db, `auction/${buyer}`);
    const unsubscribe = onValue(bidsRef, snapshot => {
      const bidsData = snapshot.val() || {};
      const bidsArray = Object.keys(bidsData).map(key => ({
        id: key,
        ...bidsData[key],
      }));
      // Sort bids in ascending order based on bid_amount
      const sortedBids = bidsArray.sort((a, b) => {
        const bidA = parseFloat(a.bid_amount) || 0; // Convert to number, default to 0 if NaN
        const bidB = parseFloat(b.bid_amount) || 0; // Convert to number, default to 0 if NaN
        return bidA - bidB; // Ascending order
      });

      // If you want to keep the greatest value at the bottom, you can reverse the sorted array
      // const reversedBids = sortedBids.reverse();

      setBids(userState.is_farmer ? bidsArray : sortedBids);

      // Scroll to the top when new data is set
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({animated: true});
      }
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [auctionId]);

  const handleAcceptBid = async bid_id => {
    if (userState.user_id || !userState.access_token) {
      try {
        const response = await axios.post(
          BASE_URL + 'market/accept_bid/',
          {
            buyer_id: userState.user_id,
            bid_id: bid_id,
          },
          {
            headers: {
              Authorization: `Bearer ${userState.access_token}`,
            },
          },
        );

        Alert.alert('Success', response.data.message);
      } catch (error) {
        console.error('ERR', error.response.data);
        Alert.alert('Error', 'Error accepting bid: ' + error.response);
      }
    } else {
      Alert.alert('Error', 'Somthing went wrong');
    }
  };

  const renderItem = ({item, index}) => (
    <View style={styles.bidItem} key={index}>
      <Text style={styles.bidText}>{`Name: ${item.bidder_name}`}</Text>
      <Text style={styles.bidText}>{`Amount: ${item.bid_amount}`}</Text>
      <Text style={styles.bidText}>{`Quantity: ${item.quantity}`}</Text>
      {!userState.is_farmer && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleAcceptBid(item.id)}>
          <Text style={styles.orderButtonText}>Accept Bid</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading bids...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={bids}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <View
        style={{
          padding: 10,
          // marginBottom: 20,
          borderColor: '#FF9100',
          borderWidth: 2,
          borderRadius: 5,
          backgroundColor: '#f0ffcb',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}>
        <Text style={styles.title}>
          Bids for Auction {crop} by {userState.name == buyer ? 'You' : buyer}
        </Text>
        <Text style={styles.subTitle}>
          Required Quantity {quantity} at {price} per kg
        </Text>
        <BidForm
          auctionId={auctionId}
          buyer={buyer}
          crop={crop}
          price={price}
          quantity={quantity}
          variety={variety}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 10,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bidItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#00712D',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#D5ED9F',
  },
  bidText: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  button: {
    backgroundColor: COLORS.green,
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default AuctionScreen;
