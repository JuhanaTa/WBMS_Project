/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Content,
  Card,
  CardItem,
  Text,
  Button,
  Icon,
  Body,
  Left,
  Right,
} from 'native-base';
import {Image} from 'react-native';
import {addLike, getLikes} from '../hooks/APIservices';
import AsyncStorage from '@react-native-community/async-storage';
import {calculateDistance} from '../hooks/distanceService';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const ListItem = ({navigation, singleMedia, userLatitude, userLongitude, distanceBool}) => {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    updateLikes();
  }, []);

  let distance = 0.0;
  if (distanceBool) {
    const descData = JSON.parse(singleMedia.description);
    distance = calculateDistance(userLatitude, userLongitude, descData.latitude, descData.longitude);
    console.log('distance: ', distance);
  }

  const likeAddition = async () => {
    const userToken = await AsyncStorage.getItem('UToken');
    const likeResponse = await addLike({
      file_id: singleMedia.file_id,
    }, userToken);
    console.log(likeResponse);
    await updateLikes();
  };

  /* const likeDeletion = async () => {
    const userToken = await AsyncStorage.getItem('UToken');
    const dislikeResponse = await deleteLike(singleMedia.file_id, userToken);
    console.log(dislikeResponse);
    await updateLikes();
  };
  */

  const updateLikes = async () => {
    const likesList = await getLikes(singleMedia.file_id);
    console.log(likesList.length);
    setLikes(likesList.length);
  };

  return (
    <Content>
      <Card style={styles.list}>
        <CardItem>
          <Left>
            <Text style={styles.title}>{singleMedia.title}</Text>
          </Left>
          <Right>
            <Text>{singleMedia.time_added}</Text>
          </Right>
        </CardItem>
        <TouchableOpacity onPress={
          () => {
            const data = {
              file: singleMedia,
              distance: distance,
            };
            navigation.navigate('Single', {file: data});
          }}>
          <CardItem cardBody >
            <Image source={{uri: mediaUrl + singleMedia.thumbnails.w640}} style={{height: 250, width: null, flex: 1}} />
          </CardItem>
        </TouchableOpacity>
        <CardItem>

          <Body style={styles.body2}>

            <Button style={styles.buttons}
              onPress={likeAddition}>
              <Text>{likes}</Text>
              <Icon style={styles.icon} active name='thumbs-up' />
            </Button>

            <Button style={styles.buttons} onPress={
              () => {
                const data = {
                  file: singleMedia,
                  distance: distance,
                };
                navigation.navigate('Single', {file: data});
              }}>
              <Icon style={styles.icon} name={'eye'}></Icon>
            </Button>

            <Button style={styles.locationBtn} >
              <Icon transparent style={[styles.icon]} name={'compass'}></Icon>
              {distance > 0.1 ? (
                <Text style={styles.Text}>{Math.round(distance)}km</Text>
              ) : (
                  <Text style={styles.Text}>here</Text>
                )
              }
            </Button>

          </Body>
        </CardItem>
      </Card>
    </Content >
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  body2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    color: '#FF421D',
    fontSize: 30,
  },
  like: {
    color: '#FF421D',
    fontSize: 30,
  },
  list: {
    marginBottom: 5,
  },
  Text: {
  },

});


ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  userLatitude: PropTypes.number,
  userLongitude: PropTypes.number,
  distanceBool: PropTypes.bool,
};

export default ListItem;
