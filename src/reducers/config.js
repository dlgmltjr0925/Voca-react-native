import * as types from '../actions/configTypes';
import * as configs from '../../config'

const initialState = {
  config: configs.baseConfig
}

const config = (state = initialState, action) => {
  switch (action.type) {
    // 저장된 세팅값을 불러오기
    case types.LOAD_CONFIG:
      return {
        ...state,
        config: action.config
      }
    case types.UPDATE_CONFIG:
      return {
        ...state,
        config: action.config
      }
    default:
      return state;
  }
}

export default config;