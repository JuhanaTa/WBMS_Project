import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  username: {
    presence: {
      message: 'Cannot be empty',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
  password: {
    presence: {
      message: 'Cannot be empty',
    },
    length: {
      minimum: 5,
      message: 'must be at least 5 characters',
    },
  },
};

const useLoginForm = (callback) => {
  const [loginErrors, setLoginErrors] = useState({});
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (name, text) => {
    const error = validator(name, text, constraints);
    console.log(name, text);
    setLoginErrors((loginErrors) => {
      return {
        ...loginErrors,
        [name]: error,
      };
    });
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };

  const validateOnSend = () => {
    const usernameError = validator('username', inputs.username, constraints);
    const passwordError = validator('password', inputs.password, constraints);

    if (usernameError !== null || passwordError !== null ) {
      return false;
    } else {
      return true;
    }
  };
  return {
    handleInputChange,
    validateOnSend,
    inputs,
    loginErrors,
  };
};

export default useLoginForm;
