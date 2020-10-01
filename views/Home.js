import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const Home = (props) => {
  const {navigation} = props;
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

  useEffect(()=>{
    getLocation();
  }, []);

  console.log('latitude in home: ', userLatitude);
  console.log('longitude in home: ', userLongitude);
  return (
    <SafeAreaView style={styles.container}>
      {userLatitude !== 0 &&
      <List navigation={navigation}
        userLatitude={userLatitude}
        userLongitude={userLongitude}
        distanceBool={true}/>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};


export default Home;
