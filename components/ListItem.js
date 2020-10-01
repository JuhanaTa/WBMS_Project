/* eslint-disable max-len */
import React from 'react';
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
} from 'native-base';
import {Image} from 'react-native';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = degreesToRadius(lat2 - lat1); // deg2rad below
  const dLon = degreesToRadius(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadius(lat1)) * Math.cos(degreesToRadius(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const degreesToRadius = (deg) => {
  return deg * (Math.PI / 180);
};


const ListItem = ({navigation, singleMedia, userLatitude, userLongitude, distanceBool}) => {
  let distance = 0.0;
  if (distanceBool) {
    console.log('listitem coords: ', userLatitude, ', ', userLongitude);
    console.log({singleMedia});
    const descData = JSON.parse(singleMedia.description);
    console.log('coordinates of item: ', descData.latitude, ', ', descData.longitude);
    distance = calculateDistance(userLatitude, userLongitude, descData.latitude, descData.longitude);
    console.log('distance: ', distance);
  }
  return (
    <Content>
      <Card style={styles.list}>
        <Text style={styles.title}>
          {distanceBool ? (
            <CardItem>
              <Left>
                <Text style={styles.text}>{singleMedia.title}</Text>
              </Left>
            </CardItem>
          ) : (
              <Text>Your Post</Text>
            )
          }
        </Text>
        <TouchableOpacity onPress={
          () => {
            navigation.navigate('Single', {file: singleMedia});
          }}>
          <CardItem cardBody >
            <Image source={{uri: mediaUrl + singleMedia.filename}} style={{height: 250, width: null, flex: 1}} />
          </CardItem>
        </TouchableOpacity>
        <CardItem>

          <Body style={styles.body2}>
            <Button style={styles.buttons} transparent>
              <Icon style={styles.icon} active name='flame' />
            </Button>
            <Button style={styles.buttons} transparent>
              <Icon style={styles.icon} active name='ice-cream' />
            </Button>
            <Button style={styles.buttons} transparent onPress={
              () => {
                navigation.navigate('Single', {file: singleMedia});
              }}>
              <Icon style={styles.icon} name={'eye'}></Icon>
            </Button>
            <Button style={styles.locationBtn} >
              <Icon transparent style={[styles.icon]} name={'compass'}></Icon>
              <Text>{Math.round(distance)}km</Text>
            </Button>
          </Body>
        </CardItem>
      </Card>
    </Content >
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
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
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 0,
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
