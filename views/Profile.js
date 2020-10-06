/* eslint-disable no-undef */
import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Body,
  ListItem,
  Button,
  Icon,
} from 'native-base';
import List from '../components/List';
import {getAvatar, setTag, upload, deleteFile} from '../hooks/APIservices';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const Profile = (props) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(AuthContext);
  const [avatar, setAvatar] = useState([]);
  const avatarArray = [];
  console.log('avatar: ', avatar);

  avatar.forEach((element) => {
    avatarArray.push(element.file_id);
    console.log('inside for each');
  });
  console.log('avatar array id: ', avatarArray);
  const uploadMedia = async (result) => {
    const uploadData = new FormData();
    console.log(result);
    uploadData.append('title', 'ProfilePic');
    uploadData.append('description', 'profilePic');

    const filename = result.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `${result.type}/${match[1]}` : result.type;
    if (type === 'image/jpg') type = 'image/jpeg';

    uploadData.append('file', {uri: result.uri, name: filename, type});
    const userToken = await AsyncStorage.getItem('UToken');

    try {
      if (avatarArray[0] === undefined) {
        console.log('nothing to delete');
      } else {
        console.log('about to delete this file: ', avatarArray[0]);
        const result = await deleteFile(avatarArray[0], userToken);
        console.log(result);
      }
    } catch (e) {
      console.log(e);
    }

    const uploadResp = await upload(uploadData, userToken);
    console.log('file uploaded, next goes tag');

    const tagResponse = await setTag({
      file_id: uploadResp.file_id,
      tag: 'avatar_' + user.user_id,
    }, userToken);

    console.log('tag post: ' + tagResponse);

    setTimeout(() => {
      fetchAvatar();
    }, 1500);
  };

  console.log('inside Profile, currently: ' + isLoggedIn);
  console.log(user);
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
    getPermissionAsync();
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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        uploadMedia(result);
      }
      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  const getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Permission needed in order you to make any uploads');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ListItem itemDivider >
        {avatar.length > 0 ?
        <Image source={{uri: mediaUrl + avatar.pop().filename}}
          style={styles.profileImage} />:
        <Image source={require('../assets/profile.png')}
          style={styles.profileImage}/>
        }
        <Body style={styles.profileBody}>
          <Text style={{fontSize: 16}}>
            <Icon style={styles.icon} name={'person'}>
            </Icon>  {user.username}</Text>
          <Text style={{fontSize: 16, marginBottom: 5}}>
            <Icon style={styles.icon} name={'at'}>
            </Icon>  {user.email}</Text>
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
      <ListItem itemDivider style={styles.header} >
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>My Posts</Text>
      </ListItem>

      <List navigation={props.navigation} all={false} />

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
    flexDirection: 'row',
    flex: 1,
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
  },
  icon: {
    color: '#FF421D',
    fontSize: 30,
  },
  header: {
    justifyContent: 'center',

  },
  btnText: {
    color: 'white',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
