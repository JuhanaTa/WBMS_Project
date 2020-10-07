import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  comment: {
    presence: {
      message: 'Cannot be empty',
    },
  },
};

const useCommentForm = (callback) => {
  const [commentErrors, setCommentErrors] = useState({});
  const [inputs, setInputs] = useState({
    comment: '',
  });

  const handleInputChange = (name, text) => {
    const error = validator(name, text, constraints);
    console.log(name, text);
    setCommentErrors((loginErrors) => {
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
    const commentError = validator('Comment', inputs.comment, constraints);

    if (commentError !== null) {
      return false;
    } else {
      return true;
    }
  };
  return {
    handleInputChange,
    validateOnSend,
    inputs,
    commentErrors,
  };
};

export default useCommentForm;
