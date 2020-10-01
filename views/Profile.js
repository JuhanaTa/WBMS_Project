import React, {useContext} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  Image,
} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Body,
  ListItem,
} from 'native-base';
import List from '../components/List';

const Profile = (props) => {
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);
  console.log('inside Profile, currently: ' + isLoggedIn);

  const signOut = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (isLoggedIn !== true) {
      props.navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title={'Logout'} onPress={signOut} />

      <ListItem itemDivider style={styles.profile}>
        <Image source={{uri: 'http://placekitten.com/160/167'}}
          style={{height: 150, width: null, flex: 1}} />
        <Body>
          <Text>Name: Tester</Text>
          <Text>Points: 9000</Text>
        </Body>
      </ListItem>

      <List distanceBool={false} navigation={props.navigation}></List>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#D4D4D4',
  },
  profile: {
    marginBottom: 5,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
