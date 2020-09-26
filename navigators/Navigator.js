import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import NewItem from '../views/NewItem';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="New" component={NewItem} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={TabScreen} />
      <Stack.Screen name="Single" component={Single} />
    </Stack.Navigator>
  );
};


const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
