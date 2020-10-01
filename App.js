/* eslint-disable no-undef */
import React, {useState, useEffect} from 'react';
import {AuthProvider} from './contexts/AuthContext';
import Navigator from './navigators/Navigator';
import * as Expo from 'expo';
import * as Font from 'expo-font';

import * as Permissions from 'expo-permissions';
import {StatusBar} from 'react-native';


const App = () => {
  const [fontReady, setFontReady] = useState(false);
  const loadFonts = async () => {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    });
    setFontReady(true);
  };

  const askLocationPermission = async () => {
    const {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Permission needed in order you to make any uploads');
    }
  };

  useEffect(() => {
    loadFonts();
    askLocationPermission();
  }, []);

  if (!fontReady) {
    console.log('Waiting for fonts...');
    return (
      <Expo.AppLoading />
    );
  }

  StatusBar.setBarStyle('light-content', true);
  StatusBar.setBackgroundColor('#FF421D');

  return (
    <>
      <AuthProvider>
        <Navigator />
      </AuthProvider>
    </>
  );
};


export default App;
