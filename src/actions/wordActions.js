import * as types from './wordTypes';

export const loadAllWords = (words) => {
  return {
    type: types.LOAD_ALL_WORDS,
    words
  }
}

export const updateWord = (words) => {
  return {
    type: types.UPDATE_WORD,
    words,
  }
}