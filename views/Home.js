

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import List from '../components/List';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <List />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});


export default Home;
