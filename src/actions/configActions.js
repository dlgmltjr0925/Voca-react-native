import * as types from './configTypes';

export const loadSetting = (config) => {
  return {
    type: types.LOAD_SETTING,
    config
  }
}