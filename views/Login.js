import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import {tokenCheck} from '../hooks/APIservices';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Container, Content, Button, Text, View} from 'native-base';

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
    <Container >
      <Content padder>
        {showReg ?
          <LoginForm navigation={props.navigation} /> :
          <RegisterForm navigation={props.navigation} />
        }
        <View style={{alignItems: 'center'}}>
          <Text> {showReg ? 'No account yet?' : ''}</Text>
        </View>
        <Button block onPress={() => {
          setShowReg(!showReg);
        }}>
          <Text> {showReg ? 'Register' : 'Login'}</Text>
        </Button>
      </Content>
    </Container>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
