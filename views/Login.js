/* eslint-disable no-undef */
import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import {tokenCheck} from '../hooks/APIservices';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Container, Content, Button, Text, View, Card, CardItem, Body}
  from 'native-base';
import {
  Image,
} from 'react-native';

const Login = (props) => { // props is needed for navigation
  const {setIsLoggedIn, setUser} = useContext(AuthContext);
  const [showReg, setShowReg] = useState(true);


  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('UToken');
    if (userToken) {
      try {
        const userData = await tokenCheck(userToken);
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
        <Image source={require('../assets/fire.png')}
          style={{height: 200, width: null}}
          resizeMode='contain' />
        <Card>
          <CardItem>
            <Body>
              {showReg ?
                <LoginForm navigation={props.navigation} /> :
                <RegisterForm navigation={props.navigation} />
              }
            </Body>
          </CardItem>
        </Card>
        <Card>
          <CardItem>
            <Body>
              <View style={{marginTop: 10}}>
                <Text style={{fontSize: 16}}>{showReg ? 'No account yet?' :
                  'Already have an account?'}</Text>
              </View>
              <Button style={{marginTop: 10}} block onPress={() => {
                setShowReg(!showReg);
              }}>
                <Text> {showReg ? 'Register' : 'Login'}</Text>
              </Button>
            </Body>
          </CardItem>
        </Card>


      </Content>
    </Container>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
