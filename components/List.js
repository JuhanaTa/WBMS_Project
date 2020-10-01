/* eslint-disable max-len */
import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/APIservices';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';


const List = ({navigation, userLatitude, userLongitude, distanceBool, all}) => {
  const {user} = useContext(AuthContext);
  const mediaArray = useLoadMedia(all, user.user_id);

  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) =>
        <ListItem singleMedia={item} navigation={navigation} userLatitude={userLatitude} userLongitude={userLongitude} distanceBool={distanceBool}/>
      }
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  userLatitude: PropTypes.number,
  userLongitude: PropTypes.number,
  distanceBool: PropTypes.bool,
  all: PropTypes.all,
};

export default List;
