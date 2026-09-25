import React from 'react';
import { AuthContext } from './src/authcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
import store from './src/store/store';
import StaticConst from './src/utils/StaticConst';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, {
    isLoading: true,
    userToken: null,
  });

  const safeParseStored = rawValue => {
    if (!rawValue) return null;
    try {
      return JSON.parse(base64.decode(rawValue));
    } catch (error) {
      try {
        return JSON.parse(rawValue);
      } catch (e) {
        return null;
      }
    }
  };

  React.useEffect(() => {
    const onBootStartApp = async () => {
      let LoggedinUser = null;
      try {
        LoggedinUser = await AsyncStorage.getItem(StaticConst.userauth.key);
        if (LoggedinUser) LoggedinUser = safeParseStored(LoggedinUser);
      } catch (e) {
        console.log('AsyncStorage read error:', e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: LoggedinUser });
      store.dispatch({ type: 'SETAUTHUSER', payload: LoggedinUser });
    };
    onBootStartApp();
  }, []);

  const AuthContextMethods = React.useMemo(
    () => ({
      signIn: async data => {
        try {
          AsyncStorage.setItem(
            StaticConst.userauth.key,
            base64.encode(JSON.stringify(data)),
          );
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: 'LOGIN', token: data });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem(StaticConst.userauth.key);
          store.dispatch({ type: 'SETAUTHUSER', payload: null });
          await AsyncStorage.removeItem(StaticConst.sessionkey.city);
          store.dispatch({ type: 'SETCITY', payload: null });
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: 'LOGOUT' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ ...AuthContextMethods, loginState }}>
      <AppNavigator />
    </AuthContext.Provider>
  );
};

export default App;
