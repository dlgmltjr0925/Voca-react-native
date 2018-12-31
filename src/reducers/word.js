import * as types from '../actions/wordTypes';

const initialState = {
  words: {}
}

const word = (state = initialState, action) => {
  switch(action.type) {
    case types.LOAD_ALL_WORDS:
      return {
        ...state,
        words: action.words
      }
    case types.UPDATE_WORD:
      return {
        ...state, 
        words: action.words
      }
    default:
      return state;
  }
}

export default word;