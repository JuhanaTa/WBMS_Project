import React, {useContext} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import {useLogin} from '../hooks/APIservices';
import FormTextInput from './FormTxtInput';
import useLoginForm from '../hooks/LoginServices';
import {Button, Text} from 'native-base';

const LoginForm = ({navigation}) => {
  // setUser,
  const {setUser, setIsLoggedIn} = useContext(AuthContext);
  const {
    handleInputChange,
    inputs,
    loginErrors,
    validateOnSend,
  } = useLoginForm();

  const doLogin = async () => {
    if (!validateOnSend()) {
      console.log('validate on send failed');
      return;
    }
    try {
      const userData = await useLogin(inputs);
      setUser(userData.user);
      console.log('user: ' + userData);
      console.log('token: ' + userData.token);
      await AsyncStorage.setItem('UToken', userData.token);
      setIsLoggedIn(true);
    } catch (e) {
      console.log('login error ', e.message);
    }
  };

  return (
    <View>
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
