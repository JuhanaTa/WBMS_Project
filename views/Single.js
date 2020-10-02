import React, {useState, useEffect} from 'react';
import {Image} from 'react-native';
import PropTypes from 'prop-types';
import {
  Card,
  CardItem,
  Left,
  Icon,
  Text,
  Content,
  Container,
} from 'native-base';
import {Video} from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

/*
Ulkoasu vaatii työtä
*/

const Single = ({route}) => {
  const {file} = route.params;
  console.log('inside single');
  console.log(file);
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
    await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
  };

  useEffect(() => {
    unlock();
    const orientSub = ScreenOrientation.addOrientationChangeListener((evt)=>{
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
              <Text>{file.file.title}</Text>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <>
              {file.file.media_type === 'image' ?
                <Image
                  source={{uri: mediaUrl + file.file.filename}}
                  style={{height: 400, width: null, flex: 1}}
                /> :
                <Video
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
            <Text>
              {file.file.description}
              {file.distance}
            </Text>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
};


Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
