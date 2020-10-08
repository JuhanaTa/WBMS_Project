import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Card,
  CardItem,
  Body,
  Text,
} from 'native-base';
import moment from 'moment';

const ListItem = ({singleComment}) => {
  console.log('singleComment: ', singleComment.comment);
  return (
    <Card >
      <CardItem>
        <View>
          <Text>{singleComment.comment}</Text>
        </View>
      </CardItem>
      <CardItem>
        <Body style={styles.body2}>
          <Text>{moment(singleComment.time_added).format('lll')}</Text>
        </Body>
      </CardItem>
    </Card>
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
  item: PropTypes.object,
  singleComment: PropTypes.object,
};


export default ListItem;
