import React, {useContext} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import {useRegistration, useLogin} from '../hooks/APIservices';
import FormTextInput from './FormTxtInput';
import useRegisterForm from '../hooks/RegisterServices';
import {Button, Text} from 'native-base';

const RegisterForm = ({navigation}) => {
  // setUser,
  const {setUser, setIsLoggedIn} = useContext(AuthContext);
  const {
    handleInputChange,
    inputs,
    registerErrors,
    validateOnSend,
    checkUserAvailable,
  } = useRegisterForm();

  const doRegister = async () => {
    if (!validateOnSend()) {
      console.log('validate on send failed');
      return;
    }
    try {
      const response = await useRegistration(inputs);
      console.log('new user added');
      console.log(response);
      const userData = await useLogin({
        username: inputs.username,
        password: inputs.password,
      });
      await AsyncStorage.setItem('UToken', userData.token);
      setIsLoggedIn(true);
      setUser(userData.user);
    } catch (e) {
      console.log('register error ', e.message);
    }
  };

  return (
    <View style={{alignSelf: 'stretch'}}>
      <FormTextInput
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        onEndEditing={checkUserAvailable}
        error={registerErrors.username}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
        error={registerErrors.password}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="confirm password"
        onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
        secureTextEntry={true}
        error={registerErrors.confirmPassword}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
        error={registerErrors.email}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="full name"
        onChangeText={(txt) => handleInputChange('full_name', txt)}
        error={registerErrors.full_name}
      />
      <Button block onPress={doRegister} ><Text>Register!</Text></Button>
    </View>
  );
};

RegisterForm.propTypes = {
  navigation: PropTypes.object,
};

export default RegisterForm;
