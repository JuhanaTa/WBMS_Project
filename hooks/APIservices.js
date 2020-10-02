
import {useEffect, useState} from 'react';
import axios from 'axios';
const apiUrl = 'http://media.mw.metropolia.fi/wbma/';
const appIdentifier = 'juhkuTest2';

const useLoadMedia = (all, userId) => {
  const [mediaArray, setMediaArray] = useState([]);
  const loadMedia = async () => {
    try {
      // const response = await fetch(apiUrl + 'media');
      const response = await fetch(apiUrl + 'tags/' + appIdentifier);
      const json = await response.json();
      const media = await Promise.all(json.map(async (item) => {
        const resp2 = await fetch(apiUrl + 'media/' + item.file_id);
        const json2 = await resp2.json();
        return json2;
      }));
      if (all) {
        setMediaArray(media);
      } else {
        setMediaArray(media.filter((item) => item.user_id === userId));
      }
    } catch (e) {
      console.error('media load error: ', e);
    }
  };
  useEffect(() => {
    loadMedia();
  }, []);

  return mediaArray;
};

const useLogin = async (user) => {
  console.log('credentials: ' + user);
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user),
  };
  try {
    const response = await fetch(apiUrl + 'login', options);
    const userData = await response.json();
    if (response.ok) {
      return userData;
    } else {
      throw new Error(userData.message);
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

const useRegistration = async (newUser) => {
  console.log(newUser);
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(newUser),
  };
  try {
    console.log(newUser);
    const response = await fetch(apiUrl + 'users', options);
    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

const tokenCheck = async (token) => {
  const options = {
    method: 'GET',
    headers: {'x-access-token': token},
  };
  try {
    const response = await fetch(apiUrl + 'users/user', options);
    const userData = await response.json();
    if (response.ok) {
      return userData;
    } else {
      throw new Error(userData.message);
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

const upload = async (fd, token) => {
  const options = {
    method: 'POST',
    headers: {'x-access-token': token},
    data: fd,
    url: apiUrl + 'media',
  };
  try {
    const response = await axios(options);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
};

const setTag = async (tag, token) => {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'x-access-token': token},
    body: JSON.stringify(tag),
  };
  try {
    console.log(tag);
    const response = await fetch(apiUrl + 'tags', options);
    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

const getAvatar = async (id) => {
  try {
    const response = await fetch(apiUrl + 'tags/avatar_' + id);

    const avatarImages = await response.json();
    if (response.ok) {
      return avatarImages;
    } else {
      throw new Error(avatarImages.message);
    }
  } catch (e) {
    throw new Error('get avatar error', e.message);
  }
};

const addLike = async (id, token) => {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'x-access-token': token},
    body: JSON.stringify(id),
  };
  try {
    console.log(id);
    const response = await fetch(apiUrl + 'favourites', options);
    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

const getLikes = async (id) => {
  try {
    const response = await fetch(apiUrl + 'favourites/file/' + id);

    const likesList = await response.json();
    if (response.ok) {
      return likesList;
    } else {
      throw new Error('get likes error');
    }
  } catch (e) {
    throw new Error('get likes error', e.message);
  }
};

const getComments = async (id) => {
  try {
    const response = await fetch(apiUrl + 'comments/file/' + id);

    const commentList = await response.json();
    if (response.ok) {
      return commentList;
    } else {
      throw new Error(commentList.message);
    }
  } catch (e) {
    throw new Error('get comment error', e.message);
  }
};


const checkUsername = async (username) => {
  try {
    const response = await fetch(apiUrl + 'users/username/' + username);

    const result = await response.json();
    if (response.ok) {
      if (result.available) {
        return null;
      } else {
        return 'Username ' + username + ' is not available';
      }
    } else {
      throw new Error(result.message);
    }
  } catch (e) {
    throw new Error(e.message);
  }
};


export {
  useLogin,
  tokenCheck,
  useRegistration,
  useLoadMedia,
  upload,
  setTag,
  getAvatar,
  addLike,
  getLikes,
  getComments,
  appIdentifier,
  checkUsername,
};
