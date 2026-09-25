import { createStore, combineReducers } from 'redux';
import GlobalReducer from './GlobalReducer';

const store = createStore(combineReducers({ GlobalReducer }));

export default store;
