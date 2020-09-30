import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

const Single = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is Single</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

Single.propTypes = {
  navigation: PropTypes.str,
};

export default Single;
