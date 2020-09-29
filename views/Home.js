
import {Text} from 'native-base';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is home</Text>
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
