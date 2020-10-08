/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
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
import PropTypes from 'prop-types';
import {addComment, getComments} from '../hooks/APIservices';
import ListComments from '../components/ListComments';
import FormTextInput from '../components/FormTxtInput';
import useCommentForm from '../hooks/CommentServices';
import AsyncStorage from '@react-native-community/async-storage';


const Comments = ({route}) => {
  const {file} = route.params;
  console.log('Kommentit tiedosto', file);
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

  const doPost = async () => {
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
      const newComment = await addComment(commentObject, userToken);
      console.log('Comment: ' + newComment);

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
      const cL = await getComments(file.file.file_id);
      setComment(cL);
      console.log('KOMMENTIT###', cL);
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
          <Button style={styles.buttom} block onPress={doPost}><Text>add comment</Text></Button>

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
  buttom: {
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
