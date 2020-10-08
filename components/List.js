/* eslint-disable max-len */
/* eslint-disable max-len */
import React from 'react';
import {FlatList} from 'react-native';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {calculateDistance} from '../hooks/distanceService';
import {View} from 'native-base';

const List = ({navigation, userLatitude, userLongitude, all, filter, dropHeader, profileHeader, mediaArray}) => {
  let data = [];
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
  // console.log('inside list');
  return (
    <View>
      {all ?
        <FlatList
          ListHeaderComponent={
            dropHeader()
          }
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
            <ListItem all={all} singleMedia={item} navigation={navigation} userLatitude={userLatitude} userLongitude={userLongitude} />
          }
        /> :
        <FlatList
          ListHeaderComponent={profileHeader()}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
            <ListItem all={all} singleMedia={item} navigation={navigation} userLatitude={userLatitude} userLongitude={userLongitude} />
          }
        />}
    </View>
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  userLatitude: PropTypes.number,
  userLongitude: PropTypes.number,
  all: PropTypes.bool,
  filter: PropTypes.string,
  dropHeader: PropTypes.func,
  profileHeader: PropTypes.func,
  mediaArray: PropTypes.array,
};

export default List;
