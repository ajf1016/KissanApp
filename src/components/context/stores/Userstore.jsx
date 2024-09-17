import React, {createContext, useReducer} from 'react';
import UserReducer from '../reducers/UserReducer';

const initialState = {
  phone: '',
  is_verified: false,
  access_token: null,
  is_farmer: false,
  phone: '',
};

export const UserContext = createContext(initialState);
const UserStore = ({children}) => {
  const [userState, userDispatch] = useReducer(UserReducer, initialState);

  return (
    <UserContext.Provider value={{userState, userDispatch}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserStore;
