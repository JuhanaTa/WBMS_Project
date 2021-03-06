/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {addComment, getComments} from '../hooks/APIservices';
import ListComments from '../components/ListComments';
import FormTextInput from '../components/FormTxtInput';
import useCommentForm from '../hooks/CommentServices';
import AsyncStorage from '@react-native-community/async-storage';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Button,
  Text,
  ListItem,
  Body,
  Toast,
} from 'native-base';


const Comments = ({route}) => {
  const {file} = route.params;
  const [comments, setComment] = useState([]);
  useEffect(() => {
    updateComments();
  }, []);
  const {
    handleInputChange,
    validateOnSend,
    inputs,
    commentErrors,
  } = useCommentForm();

  // Comment post
  const doPost = async () => {
    // validation
    if (!validateOnSend()) {
      console.log('validate on send failed');
      return;
    }
    try {
      const commentObject = {
        file_id: file.file.file_id,
        comment: inputs.comment,
      };
      const userToken = await AsyncStorage.getItem('UToken');
      // upload itself
      const newComment = await addComment(commentObject, userToken);
      console.log('Comment: ' + newComment);
      // after upload update
      await updateComments();
      Toast.show({
        duration: 3000,
        text: 'Comment added',
        type: 'success',
      });
    } catch (e) {
      console.log('COMMENT error ', e.message);
      Toast.show({
        duration: 3000,
        text: 'Comment add failed, post may be already removed',
        type: 'danger',
      });
    }
  };

  const updateComments = async () => {
    try {
      // fetches comments and they are added to comments state
      const cL = await getComments(file.file.file_id);
      setComment(cL);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ListItem itemDivider style={{margin: 2}}>
        <Body>
          <FormTextInput
            autoCapitalize="none"
            placeholder="Comment"
            onChangeText={(txt) => handleInputChange('comment', txt)}
            error={commentErrors.comment}
          />
          <Button style={styles.btn} block onPress={doPost}><Text style={styles.btnText}>add comment</Text></Button>
        </Body>
      </ListItem>
      {comments.length === 0 ?
        <Text>No comments in this post</Text> :
        <FlatList
          style={styles.lista}
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
            <ListComments singleComment={item} updateComments={updateComments}></ListComments>
          }
        />
      }
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e1e1e1',
  },
  btn: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#e1e1e1',
  },
  btnText: {
    backgroundColor: '#e1e1e1',
    color: '#000000',
  },
  lista: {
    paddingTop: 5,
    padding: 0,
  },
});

Comments.propTypes = {
  route: PropTypes.object,
};

export default Comments;
