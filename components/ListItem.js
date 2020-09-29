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


const ListItem = (props) => {
  return (
    <Content>
      <Card>
        <CardItem>
        </CardItem>
        <CardItem cardBody>
          <Image source={{uri: props.singleMedia.thumbnails.w160}} style={{height: 200, width: null, flex: 1}} />
        </CardItem>
        <CardItem>
          <Left>
            <Text>{props.singleMedia.title}</Text>
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
};

export default ListItem;
