/* eslint-disable max-len */
/* eslint-disable no-undef */
import React, {useContext, useEffect, useState} from 'react';
import List from '../components/List';
import {getAvatar, setTag, upload, deleteFile} from '../hooks/APIservices';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {loadMedia} from '../hooks/APIservices';
import {AuthContext} from '../contexts/AuthContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import {
  Body,
  ListItem,
  Button,
  Icon,
  Spinner,
} from 'native-base';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const Profile = (props) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(AuthContext);
  const [avatar, setAvatar] = useState([]);
  const [loader, setLoader] = useState(false);
  const [mediaArray, setMediaArray] = useState([]);
  const avatarArray = [];

  avatar.forEach((element) => {
    avatarArray.push(element.file_id);
  });

  // uploading avatar function
  const uploadMedia = async (result) => {
    setLoader(true);
    try {
      const uploadData = new FormData();
      uploadData.append('title', 'ProfilePic');
      uploadData.append('description', 'profilePic');

      const filename = result.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      let type = match ? `${result.type}/${match[1]}` : result.type;
      if (type === 'image/jpg') type = 'image/jpeg';

      uploadData.append('file', {uri: result.uri, name: filename, type});
      const userToken = await AsyncStorage.getItem('UToken');

      // before post last profile pic is deleted if exist
      try {
        if (avatarArray[0] === undefined) {
          console.log('nothing to delete');
        } else {
          const result = await deleteFile(avatarArray[0], userToken);
          console.log(result);
        }
      } catch (e) {
        console.log(e);
      }
      // upload itself
      const uploadResp = await upload(uploadData, userToken);
      // tag to avatar file
      const tagResponse = await setTag({
        file_id: uploadResp.file_id,
        tag: 'avatar_' + user.user_id,
      }, userToken);

      console.log('tag post: ' + tagResponse);

      fetchMedia();
      setLoader(false);
    } catch (e) {
      console.log(e);
      setLoader(false);
    }
  };


  const fetchMedia = async () => {
    setLoader(true);
    try {
      const result = await loadMedia(false, user.user_id);
      const avatarResult = await getAvatar(user.user_id);
      result.sort(function(a, b) {
        return a.file_id - b.file_id;
      });
      result.reverse();

      setLoader(false);
      setMediaArray(result);
      setAvatar(avatarResult);
    } catch (e) {
      setLoader(false);
    }
  };

  useEffect(() => {
    getPermissionAsync();
    fetchMedia();
  }, []);

  const signOut = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (isLoggedIn !== true) {
      props.navigation.navigate('Login');
    }
  };

  const pickImage = async () => {
    try {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Permission needed in order to open files');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        uploadMedia(result);
      }
    } catch (E) {
      console.log(E);
    }
  };

  // camera open
  const launchCamera = async () => {
    try {
      // persmissions first asked
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== 'granted') {
        alert('Cant use camera without permission');
        return;
      }
      const options = {
        storageOptions: {
          allowsEditing: true,
          skipBackup: true,
          path: 'images',
          quality: 1,
        },
      };
      // camera opens here
      const result = await ImagePicker.launchCameraAsync(options);
      if (!result.cancelled) {
        uploadMedia(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Permission asker
  const getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Permission needed in order you to make any uploads');
      }
    }
  };

  // Header on top of list
  const profileHeader = () => {
    return (
      <>
        <ListItem itemDivider style={styles.listStyle}>
          {avatar.length !== 0 ?
            <Image source={{uri: mediaUrl + avatar.pop().filename}}
              style={styles.profileImage} /> :
            <Image source={require('../assets/profile.png')}
              style={styles.profileImage} />
          }
          <Body style={styles.profileBody}>
            <Button block style={styles.btn} onPress={launchCamera}>
              <Icon style={styles.icon} name={'camera'}></Icon>
              <Text style={styles.btnText}>Take photo</Text>
            </Button>
            <Button block style={styles.btn} onPress={pickImage}>
              <Icon style={styles.icon} name={'image'}></Icon>
              <Text style={styles.btnText}>Change Avatar</Text>
            </Button>
            <Button block style={styles.btn} onPress={signOut}>
              <Icon style={styles.icon} name={'lock'}></Icon>
              <Text style={styles.btnText}>Log out</Text>
            </Button>
          </Body>
        </ListItem>
        <ListItem itemDivider style={styles.listStyle}><Text style={styles.iconText}>
          <Icon style={styles.icon2} name={'person'}>
          </Icon> {user.username}</Text></ListItem>
        <ListItem itemDivider style={styles.listStyle}><Text style={styles.iconText}>
          <Icon style={styles.icon2} name={'at'}>
          </Icon> {user.email}</Text></ListItem>
      </>
    );
  };

  // Profile Header is passed as prop to List
  return (
    <SafeAreaView style={styles.container}>
      {loader && <Spinner color='red' style={{alignItems: 'center'}} />}
      {mediaArray.length !== [] ?
        <List navigation={props.navigation} all={false}
          profileHeader={profileHeader}
          mediaArray={mediaArray} /> :
        <Text>laoding</Text>
      }
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#e1e1e1',
  },
  listStyle: {
    backgroundColor: '#FFFFFF',
  },
  profileBody: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 5,
  },
  profileImage: {
    height: '100%',
    width: null,
    flex: 1,
  },
  btn: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#e1e1e1',
  },
  btnText: {
    backgroundColor: '#e1e1e1',
  },
  icon: {
    color: '#FF421D',
    fontSize: 30,
    backgroundColor: '#e1e1e1',
  },
  icon2: {
    backgroundColor: '#FFFFFF',
    color: '#FF421D',
  },
  iconText: {
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
