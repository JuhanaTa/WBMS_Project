/* eslint-disable max-len */
/* eslint-disable max-len */
import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/APIservices';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';
import {calculateDistance} from '../hooks/distanceService';


const List = ({navigation, userLatitude, userLongitude, distanceBool, all}) => {
  const {user} = useContext(AuthContext);
  const mediaArray = useLoadMedia(all, user.user_id);
  const data = [];
  mediaArray.sort(function (a, b) {
    return a.file_id - b.file_id;
  });
  mediaArray.reverse();


  mediaArray.forEach((element) => {
    const descData = JSON.parse(element.description);
    console.log('lat: ', descData.latitude);
    console.log('lon: ', descData.longitude);
    data.push({
      description: descData,
      file_id: element.file_id,
      filename: element.filename,
      filesize: element.filesize,
      media_type: element.media_type,
      mime_type: element.mime_type,
      thumbnails: element.thumbnails,
      time_added: element.time_added,
      title: element.title,
      user_id: element.user_id,
      distance: calculateDistance(userLatitude, userLongitude, descData.latitude, descData.longitude),
    });
  });


  return (
    <FlatList
      data={data}
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
  all: PropTypes.bool,
};

export default List;
