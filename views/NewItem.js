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
import AsyncStorage from '@react-native-community/async-storage';
import {upload, appIdentifier, setTag} from '../hooks/APIservices';

const NewItem = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [fileType, setFileType] = useState('image');

  const uploadMedia = async () => {
    const uploadData = new FormData();
    uploadData.append('title', inputs.title);
    uploadData.append('description', inputs.description);

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

    console.log('tag post: '+tagResponse);

    setTimeout(() => {
      resetInputs();
      navigation.replace('Home');
    }, 1500);
  };


  const {
    handleInputChange,
    inputs,
    reset,
  } = useUploadForm();

  const resetInputs = () => {
    reset();
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
        <Image
          source={{uri: image}}
          style={{height: 400, width: null, flex: 1}}
        />
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
