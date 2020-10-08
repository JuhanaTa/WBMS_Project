import React, {useContext} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import {useRegistration, useLogin} from '../hooks/APIservices';
import FormTextInput from './FormTxtInput';
import useRegisterForm from '../hooks/RegisterServices';
import {Button, Text, Toast} from 'native-base';

const RegisterForm = ({navigation}) => {
  const {setUser, setIsLoggedIn} = useContext(AuthContext);
  const {
    handleInputChange,
    inputs,
    registerErrors,
    validateOnSend,
    checkUserAvailable,
  } = useRegisterForm();
  let confirmPasswordText = '';

  const doRegister = async () => {
    if (!validateOnSend()) {
      console.log('validate on send failed');
      Toast.show({
        duration: 3000,
        text: 'register inputs invalid, register failed',
        buttonText: 'Okay',
        type: 'danger',
      });
      return;
    }
    try {
      // registration, inputs passed as parameters
      console.log('inputs log: ', inputs);
      confirmPasswordText = inputs.confirmPassword;
      const response = await useRegistration(inputs);
      console.log(response);
      const userData = await useLogin({
        username: inputs.username,
        password: inputs.password,
      });
      // logs in after register is success and token is set
      await AsyncStorage.setItem('UToken', userData.token);
      setIsLoggedIn(true);
      setUser(userData.user);
    } catch (e) {
      console.log('register error ', e.message);
      handleInputChange('confirmPassword', confirmPasswordText);
      alert('user creation failed');
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
