/* eslint-disable max-len */
import React from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/APIservices';
import ListItem from './ListItem';
import PropTypes from 'prop-types';


const List = ({navigation, userLatitude, userLongitude, distanceBool}) => {
  const mediaArray = useLoadMedia();

  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) =>
        <ListItem singleMedia={item} navigation={navigation} userLatitude={userLatitude} userLongitude={userLongitude} distanceBool={distanceBool} />
      }
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  userLatitude: PropTypes.number,
  userLongitude: PropTypes.number,
  distanceBool: PropTypes.bool,
};

export default List;
