/* eslint-disable max-len */
import React, {useState, useEffect} from 'react';
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
import {getUserInfo} from '../hooks/APIservices';
import AsyncStorage from '@react-native-community/async-storage';
// url to api


const ListItem = ({singleComment, updateComments}) => {
  const [commentOwner, setCommentOwner] = useState('');
  const getCommentUser = async () => {
    try {
      const userToken = await AsyncStorage.getItem('UToken');
      const commentUser = await getUserInfo(singleComment.user_id, userToken);
      console.log(commentUser);
      setCommentOwner(commentUser);
      await updateComments();
    } catch (e) {
      console.log('comment fetch error: ', e);
    }
  };
  useEffect(() => {
    getCommentUser();
  }, []);

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
          <Text>by: {commentOwner.username}</Text>
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
    color: '#000000',
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
  updateComments: PropTypes.func,
};


export default ListItem;
