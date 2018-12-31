import { StackNavigator } from 'react-navigation'

import SearchView from './SearchView';
import WordView from './WordView';

const SearchNavigator = StackNavigator(
  {
    Main: {
      screen: SearchView,
    },
    Word: {
      screen: WordView
    }
  },
  {
    initialRouteName: 'Main',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#FCFCFC'
      }
    }
  }
)

SearchNavigator.navigationOptions = {
  header: null,
}

export default SearchNavigator;