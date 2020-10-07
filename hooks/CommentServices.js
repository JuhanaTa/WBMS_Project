import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  comment: {
    presence: {
      message: 'Cannot be empty',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
};

const useCommentForm = (callback) => {
  const [commentErrors, setCommentErrors] = useState({});
  const [inputs, setInputs] = useState({
    comment: '',
  });

  const handleInputChange = (comment, text) => {
    const error = validator(comment, text, constraints);
    console.log(comment, text);
    setCommentErrors((loginErrors) => {
      return {
        ...loginErrors,
        [comment]: error,
      };
    });
    setInputs((inputs) => {
      return {
        ...inputs,
        [comment]: text,
      };
    });
  };

  const validateOnSend = () => {
    const commentError = validator('comment', inputs.comment, constraints);
    console.log('comment error: ', commentErrors);

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
