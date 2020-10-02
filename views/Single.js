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
} from 'native-base';
import {Video} from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import {getComments} from '../hooks/APIservices';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

/*
Ulkoasu vaatii työtä
*/

const Single = ({route}) => {
  const {file} = route.params;
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


  const updateComments = async () => {
    const commentList = await getComments(file.file.file_id);
    console.log('COMMENTIT', commentList);
  };
  updateComments();


  const descData = JSON.parse(file.file.description);
  console.log('kuva', mediaUrl + file.file.filename);
  // console.log(file.distance);
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
            {file.distance > 0.1 ? (
              <Text>{Math.round(file.distance)}km</Text>
            ) : (
                <Text>here</Text>
              )
            }
          </CardItem>
          <CardItem>
            <Text>
              {descData.description}
            </Text>
          </CardItem>
        </Card>
      </Content>
    </Container>
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
};

export default Single;
