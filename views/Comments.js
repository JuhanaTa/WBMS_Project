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

      updateComments();
    } catch (e) {
      console.log('COMMENT error ', e.message);
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
      <FormTextInput
        autoCapitalize="none"
        placeholder="comment"
        onChangeText={(txt) => handleInputChange('comment', txt)}
        error={commentErrors.username}
      />
      <Button block onPress={doPost}><Text>POST</Text></Button>

      {comments.length === 0 ?
        <Text>No comments in this post</Text> :
        <FlatList
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
            <ListComments singleComment={item}></ListComments>
          }
        />
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: '#A9A4A4',
  },
});

Comments.propTypes = {
  route: PropTypes.object,
};

export default Comments;
