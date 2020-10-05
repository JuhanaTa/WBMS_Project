import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  Image,
  Platform,
} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Body,
  ListItem,
} from 'native-base';
import List from '../components/List';
import {getAvatar, setTag, upload} from '../hooks/APIservices';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const Profile = (props) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(AuthContext);
  const [avatar, setAvatar] = useState([]);
  const [image, setImage] = useState(null);
  const [fileType, setFileType] = useState('image');

  const uploadMedia = async () => {
    const uploadData = new FormData();

    uploadData.append('title', 'ProfilePic');
    uploadData.append('description', 'profilePic');

    const filename = image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `${fileType}/${match[1]}` : fileType;
    if (type === 'image/jpg') type = 'image/jpeg';

    uploadData.append('file', {uri: image, name: filename, type});
    const userToken = await AsyncStorage.getItem('UToken');

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
  const fetchAvatar = async () => {
    try {
      const result = await getAvatar(user.user_id);
      console.log('result: ', result);
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
        setImage(result.uri);
        setFileType(result.type);
        uploadMedia();
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
        <Image source={{uri: avatar.length > 0 ? mediaUrl + avatar[0].filename : 'http://placekitten.com/200/300'}}
          style={styles.profileImage} />
        <Body style={styles.profileBody}>
          <Text style={{fontSize: 16}}>Name: Tester</Text>
          <Text style={{fontSize: 16}}>Points: 9000</Text>
          <Button style={styles.btn} title={'change'} onPress={pickImage} />
          <Button style={styles.btn} title={'Log out'} onPress={signOut}
          />
        </Body>
      </ListItem>
      <ListItem itemDivider style={styles.header} >
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>My Posts</Text>
      </ListItem>

      <List distanceBool={false} navigation={props.navigation} all={false} />

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
