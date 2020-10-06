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
  Toast,
} from 'native-base';
import {Image} from 'react-native';
import {addLike, getLikes} from '../hooks/APIservices';
import AsyncStorage from '@react-native-community/async-storage';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';


const ListItem = ({navigation, singleMedia, userLatitude, userLongitude, distanceBool}) => {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    updateLikes();
  }, []);


  const likeAddition = async () => {
    try {
      const userToken = await AsyncStorage.getItem('UToken');
      const likeResponse = await addLike({
        file_id: singleMedia.file_id,
      }, userToken);
      console.log(likeResponse);
    } catch (e) {
      Toast.show({
        text: 'You have already liked this post',
        buttonText: 'Okay',
        type: 'danger',
      });
      console.log('like addition failed: ', e);
    }
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
              // distance: distance,
            };
            navigation.push('Single', {file: data});
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
                  // distance: distance,
                };
                navigation.push('Single', {file: data});
              }}>
              <Icon style={styles.icon} name={'eye'}></Icon>
            </Button>

            <Button style={styles.locationBtn} >
              <Icon transparent style={[styles.icon]} name={'compass'}></Icon>
              {singleMedia.distance > 0.1 ? (
                <Text style={styles.Text}>{Math.round(singleMedia.distance)}km</Text>
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
    marginTop: 0,
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
