import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Platform,
} from 'react-native';
import {
  Container,
  Content,
  Form,
  Button,
  Text,
} from 'native-base';
import useUploadForm from '../hooks/UploadServices';
import FormTxtInput from '../components/FormTxtInput';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-community/async-storage';
import {upload, appIdentifier, setTag} from '../hooks/APIservices';
import {Video} from 'expo-av';

const NewItem = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [fileType, setFileType] = useState('image');

  const uploadMedia = async () => {
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

    setTimeout(() => {
      resetInputs();
      navigation.replace('Home');
    }, 1500);
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

  return (
    <Container>
      <Content padder>
        <>
          {fileType === 'image' ?
            <Image
              source={{uri: image}}
              style={{height: 400, width: null, flex: 1}}
            /> :
            <Video
              source={{uri: image}}
              style={{height: 400, width: null, flex: 1}}
              useNativeControls={true}
              resizeMode="cover"
            />
          }
        </>
        <Form>
          <FormTxtInput
            autoCapitalize="none"
            placeholder="title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}

          />
          <FormTxtInput
            autoCapitalize="none"
            placeholder="description"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
          />
        </Form>

        <Button block
          onPress={pickImage}>
          <Text>Pick Media file</Text>
        </Button>
        <Button block
          onPress={launchCamera}>
          <Text>Take Photo</Text>
        </Button>
        <Button block
          onPress={uploadMedia}>
          <Text>Upload</Text>
        </Button>
        <Button block
          onPress={resetInputs}>
          <Text>Reset</Text>
        </Button>


      </Content>
    </Container>
  );
};

NewItem.propTypes = {
  navigation: PropTypes.object,
};

export default NewItem;
