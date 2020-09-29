import React, {useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
} from 'react-native';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import {tokenCheck, useLogin} from '../hooks/APIservices';
import LoginForm from '../components/LoginForm';

const Login = (props) => { // props is needed for navigation
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('UToken');
    console.log('user token log');
    console.log('token', userToken);
    if (userToken) {
      try {
        const userData = await tokenCheck(userToken);
        console.log('token valid', userData);
        setIsLoggedIn(true);
      } catch (e) {
        console.log(e.message);
      }
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  /*const user =
    {
      'username': 'Juhana',
      'password': 'WBMS2020!',
    };

  const logIn = async () => {
    const userData = await useLogin(user);
    console.log(userData);
    setIsLoggedIn(true);
    const UserToken = await AsyncStorage.setItem('UToken', userData.token);
    console.log('token added ' + UserToken);
    if (isLoggedIn) {
      props.navigation.navigate('Home');
    }
  };*/
  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <LoginForm navigation={props.navigation}/>
    </View>
  );
};
// <Button title="Sign in!" onPress={logIn}/>
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
