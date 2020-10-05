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
} from 'native-base';
import {Video} from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';


const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

/*
Ulkoasu vaatii työtä
*/

const Single = ({route, navigation}) => {
  const {file} = route.params;
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
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
  };

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


  console.log('kuva', mediaUrl + file.file.filename);

  return (
    <Container>
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
            <Icon transparent style={[styles.icon]} name={'compass'}></Icon>
            {file.file.distance > 0.1 ? (
              <Text>{Math.round(file.file.distance)}km</Text>
            ) : (
                <Text>here</Text>
              )
            }
          </CardItem>
          <CardItem>
            <Text>
              {file.file.description.description}
            </Text>
          </CardItem>
        </Card>
        <Card>
          <CardItem>
            <Button onPress={
              () => {
                const data = {
                  file: file,
                  // distance: distance,
                };
                navigation.push('Comments', {file: data.file});
              }}>
              <Icon name={'logo-twitch'}></Icon>
            </Button>
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
});

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
