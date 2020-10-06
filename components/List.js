/* eslint-disable max-len */
/* eslint-disable max-len */
import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/APIservices';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';
import {calculateDistance} from '../hooks/distanceService';


const List = ({navigation, userLatitude, userLongitude, all, filter}) => {
  const {user} = useContext(AuthContext);
  const mediaArray = useLoadMedia(all, user.user_id);
  let data = [];
  mediaArray.sort(function (a, b) {
    return a.file_id - b.file_id;
  });
  mediaArray.reverse();


  mediaArray.forEach((element) => {
    const descData = JSON.parse(element.description);
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


  if (all) {
    if (filter === '') {
      filter = 30;
    }
    data = data.filter(function (e) {
      return e.distance < filter;
    });
  }

  return (

    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) =>
        <ListItem all={all} singleMedia={item} navigation={navigation} userLatitude={userLatitude} userLongitude={userLongitude} />
      }
    />

  );
};

List.propTypes = {
  navigation: PropTypes.object,
  userLatitude: PropTypes.number,
  userLongitude: PropTypes.number,
  all: PropTypes.bool,
  filter: PropTypes.string,
};

export default List;
