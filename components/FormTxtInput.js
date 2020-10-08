import React from 'react';
import PropTypes from 'prop-types';
import {Item, Input, View, Label} from 'native-base';

const FormTextInput = ({style, error, ...otherProps}) => {
  return (
    <View>
      <Item >
        <Input {...otherProps} />
      </Item>
      {error !== 0 && <Label>{error}</Label>}
    </View>
  );
};

FormTextInput.propTypes = {
  style: PropTypes.func,
  error: PropTypes.string,
};
export default FormTextInput;
