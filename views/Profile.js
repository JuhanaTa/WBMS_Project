import React, {useContext, useEffect, useState} from 'react';
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
import {getAvatar} from '../hooks/APIservices';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const Profile = (props) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(AuthContext);
  const [avatar, setAvatar] = useState([{filename: ''}]);
  console.log('inside Profile, currently: ' + isLoggedIn);
  const fetchAvatar = async () => {
    try {
      const result = await getAvatar(user.user_id);
      setAvatar(result);
    } catch (e) {
      console.log(e.message);
    }
  };


  useEffect(() => {
    fetchAvatar();
  }, []);

  const signOut = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (isLoggedIn !== true) {
      props.navigation.navigate('Login');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ListItem itemDivider >
        <Image source={{uri: 'http://placekitten.com/200/300'}}
          style={styles.profileImage} />
        <Body style={styles.profileBody}>
          <Text style={{fontSize: 16}}>Name: Tester</Text>
          <Text style={{fontSize: 16}}>Points: 9000</Text>
          <Button style={styles.btn} title={'change picture'}/>
          <Button style={styles.btn} title={'Log out'} onPress={signOut}
          />
        </Body>
      </ListItem>
      <ListItem itemDivider style={styles.header} >
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>My Posts</Text>
      </ListItem>

      <List distanceBool={false} navigation={props.navigation}></List>

    </SafeAreaView >
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
    flexDirection: 'row',
    flex: 1,
  },
  profileBody: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImage: {
    height: 150,
    width: null,
    flex: 1,
  },
  btn: {
    marginTop: 20,
  },
  header: {
    justifyContent: 'center',

  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
