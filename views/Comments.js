/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Text,
} from 'native-base';
import PropTypes from 'prop-types';
import {getComments} from '../hooks/APIservices';
import ListComments from '../components/ListComments';


const Comments = ({route}) => {
  const {file} = route.params;
  console.log('Kommentit tiedosto', file);
  const [comments, setComment] = useState([]);
  useEffect(() => {
    updateComments();
  }, []);


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
      {comments.length === 0 ?
      <Text>No comments in this post</Text>:
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
