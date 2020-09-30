
import {useEffect, useState} from 'react';
import axios from 'axios';
const apiUrl = 'http://media.mw.metropolia.fi/wbma/';
const appIdentifier = 'juhkuAPP';

const useLoadMedia = () => {
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
      // console.log('loadMedia', media);
      setMediaArray(media);
    } catch (e) {
      console.error(e);
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

export {
  useLogin,
  tokenCheck,
  useRegistration,
  useLoadMedia,
  upload,
  setTag,
  appIdentifier,
};
