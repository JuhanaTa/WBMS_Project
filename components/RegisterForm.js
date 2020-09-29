import React, {useContext} from 'react';
import {View, Button} from 'react-native';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import {useRegistration, useLogin} from '../hooks/APIservices';
import FormTextInput from './FormTxtInput';
import useLoginForm from '../hooks/LoginServices';

const RegisterForm = ({navigation}) => {
  // setUser,
  const {setUser, setIsLoggedIn} = useContext(AuthContext);
  const {
    handleInputChange,
    inputs,
  } = useLoginForm();

  const doRegister = async () => {
    console.log(inputs);
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
    <View>
      <FormTextInput
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="full name"
        onChangeText={(txt) => handleInputChange('full_name', txt)}
      />
      <Button title="Login!" onPress={doRegister}/>
    </View>
  );
};

RegisterForm.propTypes = {
  navigation: PropTypes.object,
};

export default RegisterForm;
