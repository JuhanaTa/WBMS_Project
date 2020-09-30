/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Content,
  Card,
  CardItem,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import {Image} from 'react-native';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = degreesToRadius(lat2-lat1); // deg2rad below
  const dLon = degreesToRadius(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(degreesToRadius(lat1)) * Math.cos(degreesToRadius(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
};

const degreesToRadius = (deg) => {
  return deg * (Math.PI/180);
};


const ListItem = ({navigation, singleMedia, userLatitude, userLongitude}) => {
  console.log('listitem coords: ', userLatitude, ', ', userLongitude);
  console.log({singleMedia});
  const descData = JSON.parse(singleMedia.description);
  console.log('coordinates of item: ', descData.latitude, ', ', descData.longitude);
  const distance = calculateDistance(userLatitude, userLongitude, descData.latitude, descData.longitude);
  console.log('distance: ', distance);
  return (
    <Content>
      <Card>
        <CardItem>
        </CardItem>
        <CardItem cardBody>
          <Image source={{uri: mediaUrl + singleMedia.filename}} style={{height: 250, width: null, flex: 1}} />
        </CardItem>
        <CardItem>
          <Left>
            <Text>{singleMedia.title} Distance: {distance}</Text>
          </Left>
          <Body>
          </Body>
          <Right>
            <Button transparent>
              <Icon style={{fontSize: 38}} active name='flame' />
            </Button>
          </Right>
          <Right>
            <Button transparent>
              <Icon style={{fontSize: 38}} active name='ice-cream' />
            </Button>
          </Right>
        </CardItem>
      </Card>
    </Content >
  );
};


ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  userLatitude: PropTypes.number,
  userLongitude: PropTypes.number,
};

export default ListItem;
