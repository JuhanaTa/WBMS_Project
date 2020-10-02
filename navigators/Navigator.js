/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable max-len */
import React, {useContext} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import NewItem from '../views/NewItem';
import {AuthContext} from '../contexts/AuthContext';
import Login from '../views/Login';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      barStyle={{backgroundColor: '#FF6536'}}>
      <Tab.Screen name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
        component={Home} />

      <Tab.Screen name="New"
        options={{
          tabBarLabel: 'New',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="plus-circle" color={color} size={26} />
          ),
        }}
        component={NewItem} />
      <Tab.Screen name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
        component={Profile} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(AuthContext);
  return (
    <Stack.Navigator >
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Home" component={TabScreen}
            options={{
              title: 'Home', headerStyle: {
                backgroundColor: '#FF6536',
              },
            }} />
          <Stack.Screen name="Single" component={Single}
            options={{
              title: 'Single', headerStyle: {
                backgroundColor: '#FF6536',
              },
            }} />
        </>
      ) : (
          <>
            <Stack.Screen name="Login" component={Login}
              options={{
                title: 'Login', headerStyle: {
                  backgroundColor: '#FF6536',
                },
              }} />
          </>
        )}
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
