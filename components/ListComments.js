/* eslint-disable max-len */
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {getUserInfo} from '../hooks/APIservices';
import AsyncStorage from '@react-native-community/async-storage';
import {StyleSheet} from 'react-native';
import {
  Card,
  CardItem,
  Body,
  Text,
} from 'native-base';


const ListItem = ({singleComment, updateComments}) => {
  const [commentOwner, setCommentOwner] = useState('');
  const getCommentUser = async () => {
    try {
      // token fetch
      const userToken = await AsyncStorage.getItem('UToken');
      // info of user fetched
      const commentUser = await getUserInfo(singleComment.user_id, userToken);
      console.log(commentUser);
      setCommentOwner(commentUser);
      // comments updated after user resolved
      await updateComments();
    } catch (e) {
      console.log('comment fetch error: ', e);
    }
  };

  // resolve comment owner
  useEffect(() => {
    getCommentUser();
  }, []);

  return (
    <Card >
      <CardItem>
        <Body style={styles.body2}>
          <Text>{singleComment.comment}</Text>
        </Body>
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
  body2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

ListItem.propTypes = {
  item: PropTypes.object,
  singleComment: PropTypes.object,
  updateComments: PropTypes.func,
};


export default ListItem;
