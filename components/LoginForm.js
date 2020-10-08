import React, {useContext} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import {useLogin} from '../hooks/APIservices';
import FormTextInput from './FormTxtInput';
import useLoginForm from '../hooks/LoginServices';
import {Button, Text} from 'native-base';
import {Toast} from 'native-base';

const LoginForm = ({navigation}) => {
  const {setUser, setIsLoggedIn} = useContext(AuthContext);
  const {
    handleInputChange,
    inputs,
    loginErrors,
    validateOnSend,
  } = useLoginForm();

  // login function
  const doLogin = async () => {
    if (!validateOnSend()) {
      console.log('validate on send failed');
      Toast.show({
        duration: 3000,
        text: 'login inputs invalid, login failed',
        buttonText: 'Okay',
        type: 'danger',
      });
      return;
    }
    try {
      // inputs passed as parameters and logged in function itself
      const userData = await useLogin(inputs);
      setUser(userData.user);
      // token set
      await AsyncStorage.setItem('UToken', userData.token);
      setIsLoggedIn(true);
    } catch (e) {
      console.log('login error ', e.message);
    }
  };

  return (
    <View style={{alignSelf: 'stretch'}}>
      <FormTextInput
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        error={loginErrors.username}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
        error={loginErrors.password}
      />
      <Button block onPress={doLogin}><Text>login</Text></Button>
    </View>
  );
};

LoginForm.propTypes = {
  navigation: PropTypes.object,
};

export default LoginForm;
