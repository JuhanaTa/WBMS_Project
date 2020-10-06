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
