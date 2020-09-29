import React, {useContext} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';

const Profile = (props) => {
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);
  console.log('inside Profile, currently: ' +isLoggedIn);

  const signOut = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (isLoggedIn !== true) {
      props.navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>This is Profile</Text>
      <Button title={'Logout'} onPress={signOut} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
