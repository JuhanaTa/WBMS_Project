/* eslint-disable max-len */
import React, {useState, useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {
  Card,
  CardItem,
  Left,
  Text,
  Content,
  Container,
  Icon,
  Button,
  Body,
  Toast,
} from 'native-base';
import {Video} from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-community/async-storage';
import {addLike, getLikes} from '../hooks/APIservices';
const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

/*
Ulkoasu vaatii työtä
*/

const Single = ({route, navigation}) => {
  const {file} = route.params;
  const [likes, setLikes] = useState(0);
  console.log(file);
  console.log('inside single');
  const [videoRef, setVideoRef] = useState(null);

  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const showVideoInFullScreen = async () => {
    try {
      await videoRef.presentFullscreenPlayer();
    } catch (e) {
      console.log('svifs error ', e.message);
    }
  };

  const unlock = async () => {
    await ScreenOrientation.unlockAsync();
  };

  const lock = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  };

  useEffect(() => {
    updateLikes();
  }, []);

  useEffect(() => {
    unlock();
    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation: ', evt);
      if (evt.orientationInfo.orientation > 2) {
        showVideoInFullScreen();
      }
    });
    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef]);

  const likeAddition = async () => {
    try {
      const userToken = await AsyncStorage.getItem('UToken');
      const likeResponse = await addLike({
        file_id: file.file.file_id,
      }, userToken);
      console.log(likeResponse);
    } catch (e) {
      Toast.show({
        duration: 2000,
        text: 'already liked this post, or it is deleted',
        buttonText: 'Okay',
        type: 'danger',
      });
      console.log('like addition failed: ', e);
    }
    await updateLikes();
  };

  const updateLikes = async () => {
    const likesList = await getLikes(file.file.file_id);
    setLikes(likesList.length);
  };
  console.log('kuva', mediaUrl + file.file.filename);


  return (
    <Container style={styles.container}>
      <Content padder>
        <Card>
          <CardItem>
            <Left>
              <Icon name={'image'} />
              <Text style={styles.title}>{file.file.title}</Text>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <>
              {file.file.media_type === 'image' ?
                <Image
                  source={{uri: mediaUrl + file.file.filename}}
                  style={{height: 350, width: null, flex: 1, resizeMode: 'contain'}}
                /> :
                < Video
                  ref={handleVideoRef}
                  source={{
                    uri:
                      mediaUrl + file.file.filename,
                  }}
                  style={{height: 400, width: null, flex: 1}}
                  useNativeControls={true}
                  resizeMode="cover"
                  posterSource={{uri: mediaUrl + file.file.screenshot}}
                />
              }
            </>
          </CardItem>
          <CardItem>
            <Body style={styles.body2}>
              <Button style={styles.buttons}
                onPress={likeAddition}>
                <Text style={styles.text}>{likes}</Text>
                <Icon style={styles.icon} active name='flame' />
              </Button>
              <Button style={styles.buttons} onPress={
                () => {
                  const data = {
                    file: file,
                  };
                  navigation.push('Comments', {file: data.file});
                }}>
                <Icon style={styles.icon} name={'chatbubbles'}></Icon>
              </Button>
              <Button style={styles.buttons} onPress={
                () => {
                  const data = {
                    latitude: file.file.description.latitude,
                    longitude: file.file.description.longitude,
                    title: file.file.title,
                  };
                  navigation.push('Map', {file: data});
                }}>
                <Icon transparent style={styles.icon} name={'compass'}></Icon>
                {file.file.distance > 0.1 ? (
                  <Text style={styles.text}>{Math.round(file.file.distance)}km</Text>
                ) : (
                    <Text style={styles.text}>here</Text>
                  )
                }
              </Button>
            </Body>
          </CardItem>
          <CardItem>
            <Text>
              {file.file.description.description}
            </Text>
          </CardItem>
        </Card>
      </Content>
    </Container >
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    color: '#FF421D',
    fontSize: 30,
  },
  body2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: '#e1e1e1',
  },
  buttons: {
    color: '#FF421D',
    fontSize: 30,
    backgroundColor: '#e1e1e1',
  },
  text: {
    backgroundColor: '#e1e1e1',
    color: '#000000',
  },
});

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
