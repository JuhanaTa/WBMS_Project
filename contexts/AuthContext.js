import React, {useState} from 'react';
import PropTypes from 'prop-types';

const AuthContext = React.createContext({});

const AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, user, setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export {AuthContext, AuthProvider};
