import React, {useContext} from 'react';
import {View, Button} from 'react-native';
import PropTypes from 'prop-types';
import {AuthContext} from '../contexts/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import {useLogin} from '../hooks/APIservices';
import FormTextInput from './FormTxtInput';
import useLoginForm from '../hooks/LoginServices';

const LoginForm = ({navigation}) => {
  // setUser,
  const {setUser, setIsLoggedIn} = useContext(AuthContext);
  const {
    handleInputChange,
    inputs,
  } = useLoginForm();

  const doLogin = async () => {
    console.log(inputs);
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
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
      />

      <Button title="Login!" onPress={doLogin}/>
    </View>
  );
};

LoginForm.propTypes = {
  navigation: PropTypes.object,
};

export default LoginForm;
