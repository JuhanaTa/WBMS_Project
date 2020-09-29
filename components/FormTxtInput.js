import React from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  StyleSheet,
} from 'react-native';

const FormTextInput = ({style, ...otherProps}) => {
  return (
    <TextInput
      style={[styles.textInput, style]}
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});


FormTextInput.propTypes = {
  style: PropTypes.func,
  error: PropTypes.string,
};
export default FormTextInput;
