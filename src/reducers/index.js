import { combineReducers } from 'redux';
import config from './config';
import word from './word'

const reducers = combineReducers({
  config, 
  word,
})

export default reducers;