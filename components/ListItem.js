/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Image} from 'react-native';
import {addLike, getLikes, deleteFile} from '../hooks/APIservices';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {TouchableOpacity, StyleSheet, Alert} from 'react-native';
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


const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const ListItem = ({navigation, singleMedia, all}) => {
  const [likes, setLikes] = useState(0);
  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      updateLikes();
    });
    updateLikes();
    return listener;
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
        duration: 2000,
        text: 'already liked this post, or it is deleted',
        buttonText: 'Okay',
        type: 'danger',
      });
      console.log('like addition failed: ', e);
    }
    await updateLikes();
  };

  const deleteAlert = () => {
    Alert.alert(
        'Alert',
        //  body
        'Are you sure you want to delete this post?',
        [
          {
            text: 'Yes',
            onPress: () => deletePost(),
          },
          {
            text: 'No',
            onPress: () => console.log('delete cancelled'), style: 'cancel',
          },
        ],
        {cancelable: false},
    );
  };

  const deletePost = async () => {
    try {
      const userToken = await AsyncStorage.getItem('UToken');
      const result = await deleteFile(singleMedia.file_id, userToken);
      console.log('delete result: ', result);
      navigation.replace('Home');
    } catch (e) {
      console.log('deletion failed ', e);
    }
  };

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
            <Text>{moment(singleMedia.time_added).format('lll')}</Text>
          </Right>
        </CardItem>
        <TouchableOpacity onPress={
          () => {
            const data = {
              file: singleMedia,
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
              <Text style={styles.buttonText}>{likes}</Text>
              <Icon style={styles.icon} active name='flame' />
            </Button>
            <Button style={styles.buttons} onPress={
              () => {
                const data = {
                  file: singleMedia,
                };
                navigation.push('Single', {file: data});
              }}>
              <Icon style={styles.icon} name={'eye'}></Icon>
            </Button>
            {!all ?
              <Button style={styles.buttons} onPress={
                () => {
                  deleteAlert();
                }}>
                <Text style={styles.buttonText}>Del</Text>
                <Icon style={styles.icon} name={'trash'}></Icon>
              </Button> :
              <Button style={styles.buttons} onPress={
                () => {
                  const data = {
                    latitude: singleMedia.description.latitude,
                    longitude: singleMedia.description.longitude,
                    title: singleMedia.title,
                  };
                  navigation.push('Map', {file: data});
                }}>
                <Icon transparent style={[styles.icon]} name={'compass'}></Icon>
                {singleMedia.distance > 0.1 ? (
                  <Text style={styles.buttonText}>{Math.round(singleMedia.distance)}km</Text>
                ) : (
                    <Text style={styles.buttonText}>here</Text>
                  )
                }
              </Button>
            }
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
  list: {
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  buttons: {
    color: '#FF421D',
    fontSize: 30,
    backgroundColor: '#e1e1e1',
  },
  buttonText: {
    backgroundColor: '#e1e1e1',
    color: '#000000',
  },
});


ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  all: PropTypes.bool,
};

export default ListItem;
