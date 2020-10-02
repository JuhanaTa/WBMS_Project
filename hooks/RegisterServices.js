import {useState} from 'react';
import {validator} from '../utils/validator';
import {checkUsername} from './APIservices';

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
  confirmPassword: {
    equality: 'password',
  },
  email: {
    presence: {
      message: 'Cannot be empty',
    },
    email: {
      message: 'address is not valid',
    },
  },
  full_name: {
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
};

let inputs= {
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  full_name: '',
};

const useSignUpForm = (callback) => {
  const [registerErrors, setRegisterErrors] = useState({});

  const handleInputChange = (name, text) => {
    const addInputs = () => {
      inputs = {...inputs, [name]: text};
    };
    addInputs();
    console.log(inputs);
    let error;
    setRegisterErrors((registerErrors) => {
      if (name === 'confirmPassword') {
        error = validator(name, {
          password: inputs.password,
          confirmPassword: inputs.confirmPassword,
        }, constraints);
      } else {
        error = validator(name, text, constraints);
      }
      return {
        ...registerErrors,
        [name]: error,
      };
    });
  };
  const validateOnSend = () => {
    const confirmError = validator('confirmPassword', {
      password: inputs.password,
      confirmPassword: inputs.confirmPassword,
    }, constraints);
    console.log('confirm pw error', confirmError);
    setRegisterErrors((registerErrors) => ({
      ...registerErrors,
      confirm: confirmError,
    }));

    for (const value of Object.values(registerErrors)) {
      console.log('validation error: ', value);
      if (value !== null) {
        return false;
      }
    }
    inputs= {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      full_name: '',
    };
    return true;
  };

  const checkUserAvailable = async (event) => {
    const username = event.nativeEvent.text;
    try {
      const result = await checkUsername(username);
      setRegisterErrors((registerErrors) => ({
        ...registerErrors,
        username: result,
      }));
    } catch (error) {
      console.log('checkUserAvailable error ', error);
    }
  };
  return {
    checkUserAvailable,
    handleInputChange,
    validateOnSend,
    inputs,
    registerErrors,
  };
};

export default useSignUpForm;
