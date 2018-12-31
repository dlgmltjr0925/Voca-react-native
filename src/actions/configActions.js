import * as types from './configTypes';

export const loadConfig = (config) => {
  return {
    type: types.LOAD_CONFIG,
    config
  }
}