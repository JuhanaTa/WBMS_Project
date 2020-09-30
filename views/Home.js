import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import List from '../components/List';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const Home = () => {
  const [userLatitude, setUserLatitude] = useState(0);
  const [userLongitude, setUserLongitude] = useState(0);
  const getLocation = async () => {
    try {
      // permission to get user location
      const {status} = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        // get location
        const userLocation = await Location.getCurrentPositionAsync();
        setUserLatitude(userLocation.coords.latitude);
        setUserLongitude(userLocation.coords.longitude);
      } else {
        console.log('Permission denied');
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  getLocation();

  console.log('latitude in home: ', userLatitude);
  console.log('longitude in home: ', userLongitude);
  return (
    <SafeAreaView style={styles.container}>
      <List userLatitude={userLatitude} userLongitude={userLongitude}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});


export default Home;
