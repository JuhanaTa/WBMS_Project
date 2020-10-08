/* eslint-disable max-len */
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  // Alert,
} from 'react-native';
import {
  Card,
  CardItem,
  Body,
  Text,
  // Button,
  // Icon,
  // Toast,
} from 'native-base';
import moment from 'moment';
import {getUserInfo} from '../hooks/APIservices';
import AsyncStorage from '@react-native-community/async-storage';
// import {AuthContext} from '../contexts/AuthContext';
// url to api

const ListItem = ({singleComment, updateComments}) => {
  // const {user} = useContext(AuthContext);
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

  /* const deleteComment = async () => {
    console.log('hello');
    try {
      console.log('hello');
      const userToken = await AsyncStorage.getItem('UToken');
      const response = await deleteComment(singleComment.comment_id, userToken);
      console.log(response);
      Toast.show({
        duration: 3000,
        text: 'Comment deleted',
        type: 'success',
      });
    } catch (e) {
      console.log('error: ', e);
      Toast.show({
        duration: 3000,
        text: 'delete failed',
        type: 'success',
      });
    }
  }; */

  /* <Button onPress={deleteComment}>
  <Icon style={styles.icon} active name='trash' /></Button>
  </> :
  <Text>{singleComment.comment}</Text>
    */
  useEffect(() => {
    getCommentUser();
  }, []);

  console.log('singleComment: ', singleComment.comment);
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
    fontSize: 20,
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
