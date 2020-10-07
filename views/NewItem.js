/* eslint-disable no-undef */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  Container,
  Content,
  Form,
  Button,
  Text,
  View,
  CardItem,
  Card,
  Body,
  Spinner,
} from 'native-base';
import useUploadForm from '../hooks/UploadServices';
import FormTxtInput from '../components/FormTxtInput';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-community/async-storage';
import {upload, appIdentifier, setTag} from '../hooks/APIservices';
import {Video} from 'expo-av';
import {TouchableOpacity} from 'react-native-gesture-handler';

const NewItem = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [fileType, setFileType] = useState('image');
  let height = 0;

  const uploadMedia = async () => {
    setLoader(true);
    try {
      const uploadData = new FormData();
      const userLocation = await getLocation();

      const descData = {
        description: inputs.description,
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      };

      uploadData.append('title', inputs.title);
      uploadData.append('description', JSON.stringify(descData));

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
        tag: appIdentifier,
      }, userToken);

      console.log('tag post: ' + tagResponse);


      resetInputs();
      navigation.replace('Home');
      setLoader(false);
    } catch (e) {
      console.log('error: ', e);
    }
  };

  const getLocation = async () => {
    try {
      // permission to get user location
      const {status} = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        // get location
        const userLocation = await Location.getCurrentPositionAsync();
        console.log('location of user');
        console.log(userLocation);
        return userLocation;
      } else {
        console.log('Permission denied');
      }
    } catch (e) {
      console.log(e.message);
    }
  };


  const {
    handleInputChange,
    uploadErrors,
    inputs,
    reset,
  } = useUploadForm();

  const resetInputs = () => {
    reset();
    setImage(null);
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
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  const launchCamera = async () => {
    const options = {
      storageOptions: {
        allowsEditing: true,
        skipBackup: true,
        path: 'images',
        quality: 1,
      },
    };
    const result = await ImagePicker.launchCameraAsync(options);
    if (!result.cancelled) {
      setImage(result.uri);
      setFileType(result.type);
    }
    console.log(result);
  };

  const getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Permission needed in order you to make any uploads');
      }
    }
  };
  useEffect(() => {
    getPermissionAsync();
  }, []);

  if (image !== null) {
    height = 300;
  }
  return (
    <Container style={{backgroundColor: '#e1e1e1'}}>
      <Content padder>

        {image === null ?
          <TouchableOpacity onPress={pickImage}>
            <Image source={require('../assets/placeholder-image.png')}
              style={{height: 300, width: null}} />
          </TouchableOpacity> :
          <View>
            {fileType === 'image' ?
              <Image
                source={{uri: image}}
                style={{height: height, width: null}}
              /> :
              <Video
                source={{uri: image}}
                style={{height: height, width: null}}
                useNativeControls={true}
                resizeMode="cover"
              />
            }
          </View>}

        <Card>
          <CardItem>
            <Body>
              <Form style={{alignSelf: 'stretch'}}>
                <FormTxtInput
                  autoCapitalize="none"
                  placeholder="title"
                  value={inputs.title}
                  onChangeText={(txt) => handleInputChange('title', txt)}
                  error={uploadErrors.title}

                />
                <FormTxtInput
                  autoCapitalize="none"
                  placeholder="description"
                  value={inputs.description}
                  onChangeText={(txt) => handleInputChange('description', txt)}
                  error={uploadErrors.description}
                />
              </Form>


              <View style={styles.buttonsForImage}>
                <Button block style={styles.imgbtn1}
                  onPress={pickImage}>
                  <Text>Pick Media file</Text>
                </Button>
                <Button block style={styles.imgbtn2}
                  onPress={launchCamera}>
                  <Text>Take Photo</Text>
                </Button>
              </View>

              <View style={{alignSelf: 'stretch'}}>
                <Button block style={styles.btn}
                  disabled={uploadErrors.title !== null ||
                    uploadErrors.description !== null || image === null
                  }
                  onPress={uploadMedia}>
                  <Text>Upload</Text>
                </Button>
                {loader &&<Spinner color='red' style={{alignItems: 'center'}}/>}
                <Button block style={styles.btn}
                  onPress={resetInputs}>
                  <Text>Reset</Text>
                </Button>
              </View>
            </Body>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginTop: 5,
  },
  buttonsForImage: {
    flex: 1,
    flexDirection: 'row',
  },
  imgbtn1: {
    flex: 1,

    marginRight: 5,
  },
  imgbtn2: {
    flex: 1,
    marginLeft: 5,

  },
});

NewItem.propTypes = {
  navigation: PropTypes.object,
};

export default NewItem;
