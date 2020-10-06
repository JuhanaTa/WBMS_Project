import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Card,
  CardItem,
  Body,
  Text,
} from 'native-base';
// url to api


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
          <Text>{singleComment.time_added}</Text>
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
