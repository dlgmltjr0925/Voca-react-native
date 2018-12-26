import * as types from '../actions/configTypes';
import * as configs from '../../config'

const initialState = {
  config: configs.baseConfig
}

const configReducer = (state = initialState, action) => {
  switch (action.type) {
    // 저장된 세팅값을 불러오기
    case types.LOAD_SETTING:
      return {
        ...state,
        config: action.config
      }
    default:
      return state;
  }
}

export default configReducer;