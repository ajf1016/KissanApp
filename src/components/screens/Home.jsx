// App.js
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../../apiConfig';
import {UserContext} from '../context/stores/Userstore';
import {useNavigation} from '@react-navigation/native';

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your Unsplash API key

const Home = () => {
  const {userDispatch, userState} = useContext(UserContext);
  const [isLoading, setLoading] = useState(true);
  const [variety, setVariety] = useState('');
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [bids, setBids] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  let navigation = useNavigation();

  console.log('USERUSER', userState);

  // Load auction bids when component mounts
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        // Get the access token from userState or AsyncStorage as fallback
        let token = userState?.access_token;

        if (!token) {
          console.log('TK1', token);
          const user_data = await AsyncStorage.getItem('user');
          const parsedUserData = JSON.parse(user_data);

          if (parsedUserData?.access_token) {
            token = parsedUserData.access_token;
          } else {
            throw new Error('User is not logged in or access token missing.');
          }
        }

        // API call to fetch auction bids
        const response = await axios.get(BASE_URL + 'market/list-auctions/', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the access token in the header
          },
        });

        console.log('AUCTION LIST', response.data);

        // Update the bids state with the fetched auction data
        setBids(response.data.auctions);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching auctions:', error);
        setLoading(false); // Set loading to false if there's an error
        Alert.alert(
          'Error',
          'Something went wrong while fetching the auctions.',
        );
      }
    };

    fetchAuctions(); // Call the function to fetch data
  }, [userState]); // Run effect on userState changes

  // Fetch image based on crop name from Unsplash
  const fetchImage = async crop => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: {
            query: crop,
            per_page: 1,
          },
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`, // Add your Unsplash Access Key
          },
        },
      );
      const imageUrl = response.data.results[0]?.urls?.small;
      setImageUrls(prevState => ({
        ...prevState,
        [crop]: imageUrl || 'https://via.placeholder.com/150', // Fallback image
      }));
    } catch (error) {
      console.error(error);
    }
  };
  console.log(bids);
  // Function to create auction
  const createAuction = async () => {
    if (!variety || !cropName || !quantity || !price) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    // Fetch the image for the crop
    fetchImage(cropName);

    try {
      // Get the access token from userState or AsyncStorage as fallback
      let token = userState?.access_token;

      if (!token) {
        const user_data = await AsyncStorage.getItem('user');
        const parsedUserData = JSON.parse(user_data);

        if (parsedUserData?.access_token) {
          token = parsedUserData.access_token;
        } else {
          throw new Error('User is not logged in or access token missing.');
        }
      }

      console.log('TK2', token);

      // Auction data to be sent to the API
      const auctionData = {
        crop_name: cropName,
        variety_of_crop: variety,
        quantity: quantity,
        price: price,
      };

      // API call to create the auction
      const response = await axios.post(
        BASE_URL + 'market/create-auction/',
        auctionData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the access token in the header
            'Content-Type': 'application/json',
          },
        },
      );

      // Handle the response from the server
      if (response.status === 201) {
        Alert.alert('Success', 'Auction created successfully!');
        setBids([...bids, auctionData]);
        // Clear input fields
        setVariety('');
        setCropName('');
        setQuantity('');
        setPrice('');
      } else {
        Alert.alert('Error', 'Failed to create the auction.');
      }
    } catch (error) {
      console.error('Error during auction creation:', error);
      Alert.alert('Error', 'Something went wrong while creating the auction.');
    }
  };

  const renderBidItem = ({item}) => {
    console.log(item);
    return (
      <View style={styles.bidBox}>
        <Image source={{uri: item.imageUrl}} style={styles.cropImage} />
        <Text style={styles.bidText}>
          <Text style={styles.bidLabel}>Variety:</Text> {item.variety_of_crop}
        </Text>
        <Text style={styles.bidText}>
          <Text style={styles.bidLabel}>Crop:</Text> {item.crop_name}
        </Text>
        <Text style={styles.bidText}>
          <Text style={styles.bidLabel}>Quantity:</Text> {item.quantity}
        </Text>
        <Text style={styles.bidText}>
          <Text style={styles.bidLabel}>Price:</Text> ${item.price}
        </Text>
        {/* {userState.is_farmer && ( */}
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() =>
            navigation.navigate('AuctionScreen', {
              auctionId: item.id,
              buyer: item.buyer_name,
              crop: item.crop_name,
              price: item.price,
              quantity: item.quantity,
              variety: item.variety_of_crop,
            })
          }>
          <Text style={styles.orderButtonText}>
            {userState.is_farmer ? 'Start Bid' : 'Watch Bid'}
          </Text>
        </TouchableOpacity>
        {/* )} */}
      </View>
    );
  };

  return isLoading ? (
    <ActivityIndicator size="large" color="#00ff00" />
  ) : (
    <View
      style={{
        backgroundColor: '#fff',
        paddingHorizontal: '2%',
      }}>
      {userState.is_farmer && (
        <Text style={styles.title}>Available Auctions</Text>
      )}
      <FlatList
        data={bids}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderBidItem}
        ListHeaderComponent={() =>
          !userState.is_farmer ? (
            <View style={styles.formContainer}>
              <Text style={styles.title}>Auction Page</Text>
              <TextInput
                value={variety}
                onChangeText={setVariety}
                placeholder="Vegetables or Fruits"
                style={styles.input}
              />
              <TextInput
                value={cropName}
                onChangeText={setCropName}
                placeholder="Crop Name"
                style={styles.input}
              />
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Quantity"
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="Price"
                keyboardType="numeric"
                style={styles.input}
              />
              <TouchableOpacity onPress={createAuction} style={styles.button}>
                <LinearGradient
                  colors={['#FF9933', '#FFFFFF', '#138808']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.gradientButton}>
                  <Text style={styles.buttonText}>Create New Auction</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={() => (
          <Text style={styles.noBidsText}>No auctions available.</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  button: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bidsContainer: {
    marginTop: 20,
  },
  bidsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  bidBox: {
    padding: 15,
    backgroundColor: '#fff',

    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderColor: '#FF9100',
    borderWidth: 2,
    borderRadius: 5,
  },
  cropImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  bidText: {
    fontSize: 16,
    marginBottom: 10,
  },
  bidLabel: {
    fontWeight: 'bold',
  },
  orderButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  noBidsText: {
    textAlign: 'center',
  },
});

export default Home;
