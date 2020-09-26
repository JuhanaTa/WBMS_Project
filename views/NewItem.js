import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is New Item</Text>
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
