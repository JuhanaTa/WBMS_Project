/* eslint-disable max-len */
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';

const MapScreen = ({route}) => {
  const {file} = route.params;
  const latitude = file.latitude;
  const longitude = file.longitude;
  const title = file.title;

  return (
    <SafeAreaView style={styles.container}>
      <MapView style={styles.mapStyle} initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }} >
        <MapView.Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title={title}
        />

      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A9A4A4',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

MapScreen.propTypes = {
  route: PropTypes.object,
};

export default MapScreen;
