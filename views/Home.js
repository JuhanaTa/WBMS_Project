import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import {
  Form, Item, View, Picker, Icon, Spinner,
} from 'native-base';
import {AuthContext} from '../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import {loadMedia} from '../hooks/APIservices';


const Home = (props) => {
  const {navigation} = props;
  const [userLatitude, setUserLatitude] = useState(0);
  const [userLongitude, setUserLongitude] = useState(0);
  const [filter, setFilter] = useState('');
  const [loader, setLoader] = useState(false);
  const {setIsLoggedIn} = useContext(AuthContext);
  const [mediaArray, setMediaArray] = useState([]);
  const {user} = useContext(AuthContext);

  const getLocation = async () => {
    setLoader(true);
    try {
      // permission to get user location
      const {status} = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        // get location
        const userLocation = await Location.getCurrentPositionAsync();
        setUserLatitude(userLocation.coords.latitude);
        setUserLongitude(userLocation.coords.longitude);
        setLoader(false);
      } else {
        console.log('Permission denied');
        Alert.alert(
          'Alert',
          //  body
          'This app needs your location in order to work',
          [
            {
              text: 'Agreed',
              onPress: () => console.log('agreed'),
            },

          ],
          {cancelable: false},
        );
        await AsyncStorage.clear();
        setIsLoggedIn(false);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const fetchMedia = async () => {
    const result = await loadMedia(true, user.user_id);
    result.sort(function (a, b) {
      return a.file_id - b.file_id;
    });
    result.reverse();
    setMediaArray(result);
  };

  console.log('filter is: ', filter);

  useEffect(() => {
    getLocation();
    fetchMedia();
  }, []);

  const dropHeader = () => {
    return (
      <View>
        <Form>
          <Item picker style={styles.dropdown}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={{width: undefined}}
              placeholder='select filter'
              placeholderStyle={{color: '#bfc6ea'}}
              placeholderIconColor="#007aff"
              selectedValue={filter}
              onValueChange={(value) => {
                setFilter(value);
              }}
            >
              <Picker.Item label="30km" value="30" />
              <Picker.Item label="20km" value="20" />
              <Picker.Item label="10km" value="10" />
              <Picker.Item label="5km" value="5" />
              <Picker.Item label="1km" value="1" />
            </Picker>
          </Item>
        </Form>
      </View>
    );
  };


  console.log('latitude in home: ', userLatitude);
  console.log('longitude in home: ', userLongitude);
  return (
    <SafeAreaView style={styles.container}>
      {loader && <Spinner color='red' style={{alignItems: 'center'}} />}
      {userLatitude !== 0 &&
        <List
          Lis
          navigation={navigation}
          userLatitude={userLatitude}
          userLongitude={userLongitude}
          distanceBool={true}
          all={true}
          filter={filter}
          dropHeader={dropHeader}
          mediaArray={mediaArray}
        />
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#e1e1e1',
  },
  form: {
    width: '100%',

  },
  filterContainer: {
    flexDirection: 'row',
  },

  dropdown: {
    backgroundColor: 'white',
    borderTopWidth: 2,
    borderTopColor: '#000000',
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};


export default Home;
