import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Button,
} from 'react-native';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import {tokenCheck} from '../hooks/APIservices';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = (props) => { // props is needed for navigation
  const {isLoggedIn, setIsLoggedIn, setUser} = useContext(AuthContext);
  const [showReg, setShowReg] = useState(true);


  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('UToken');
    console.log('logged in?: ' + isLoggedIn);
    console.log('token', userToken);
    if (userToken) {
      try {
        const userData = await tokenCheck(userToken);
        console.log('token valid', userData);
        setIsLoggedIn(true);
        setUser(userData);
      } catch (e) {
        console.log(e.message);
      }
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  return (
    <View style={styles.container}>
      {showReg ?
        <LoginForm navigation={props.navigation} /> :
        <RegisterForm navigation={props.navigation} />
      }
      <Button title={showReg ? 'Register' : 'Login'} onPress={() => {
        setShowReg(!showReg);
      }}>
      </Button>
    </View>
  );
};
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
