/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {getComments} from '../hooks/APIservices';
import {FlatList} from 'react-native-gesture-handler';


const Comments = ({route}) => {
  const {file} = route.params;
  console.log('Kommentit tiedosto', file);
  const [comment, setComment] = useState([]);
  useEffect(() => {
    updateComments();
  }, []);


  const updateComments = async () => {
    try {
      const cL = await getComments(file.file.file_id);
      setComment(cL);
      console.log('KOMMENTIT###', cL[0].comment);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>This is COMMANTS</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
});

Comments.propTypes = {
  route: PropTypes.object,
};

export default Comments;
