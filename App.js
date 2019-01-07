/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, Image, AsyncStorage } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Views } from './src/components';
import { connect } from 'react-redux';

import { baseConfig } from './config';
import { configActions, wordActions } from './src/actions';
import word from './src/reducers/word';

const TabBarIcon = (props) => (<Image style={styles.tabBarIcon} source={props.source} />)

// 단어 검색 및 입력이 가능한 View
const SearchStack = createStackNavigator({
  Search: Views.SearchNavigator, 
})
SearchStack.navigationOptions = {
  tabBarLabel: 'Search',
  tabBarIcon: ({ focused }) => (focused
    ? <TabBarIcon source={require('./assets/icons/tab_search_true.png')} />
    : <TabBarIcon source={require('./assets/icons/tab_search_false.png')} />
  )
}

// 단어 시험이 가능한 View
const ExamStack = createStackNavigator({
  Exam: Views.ExamView
})
ExamStack.navigationOptions = {
  tabBarLabel: 'Exam',
  tabBarIcon: ({ focused }) => (focused
    ? <TabBarIcon source={require('./assets/icons/tab_exam_true.png')} />
    : <TabBarIcon source={require('./assets/icons/tab_exam_false.png')} />
  )
}

// 어플 사용에 필요한 설정을 조작할 수 있는 View
const SettingStack = createStackNavigator({
  Setting: Views.SettingView
})
SettingStack.navigationOptions = {
  tabBarLabel: 'Setting',
  tabBarIcon: ({ focused }) => (focused
    ? <TabBarIcon source={require('./assets/icons/tab_setting_true.png')} />
    : <TabBarIcon source={require('./assets/icons/tab_setting_false.png')} />
  )
}

const bottomTabNavigator = createBottomTabNavigator({
  SearchStack,
  ExamStack,
  SettingStack
})

const AppNavigator = createSwitchNavigator({
  Main: bottomTabNavigator
})

class App extends Component {
  constructor(props) {
    super(props);
    this._loadConfigFromAsyncStore = this._loadConfigFromAsyncStore.bind(this);
  }

  _loadConfigFromAsyncStore = async () => {
    // if (process.env !== 'prd') await AsyncStorage.removeItem('CONFIG');
    let config = JSON.parse(await AsyncStorage.getItem('CONFIG')); // key : CONFIG
    if (!config) {
      config = this.props.config;
      await AsyncStorage.setItem('CONFIG', JSON.stringify(config));
    }
    this.props.handleLoadConfig(config);
  }

  _loadWordFromAsyncStore = async () => {
    // if (process.env !== 'prd' ) await AsyncStorage.removeItem('WORD');
    const keys = await AsyncStorage.getAllKeys();
    if (!keys.includes('WORDS')) await AsyncStorage.setItem('WORDS', JSON.stringify(this.props.words))
    const words = JSON.parse(await AsyncStorage.getItem('WORDS'));
    if (Object.keys(words).length > 0) this.props.handleLoadAllWords(words);
  }

  componentWillMount() {
    this._loadConfigFromAsyncStore()
    this._loadWordFromAsyncStore()
  }

  render() {
    return (
      <View style={styles.container}>
        <AppNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarIcon: {
    height: 23,
    width: 23
  }
});

const mapStateToProps = (state) => {
  return {
    config: state.config.config, 
    words: state.word.words
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoadConfig: (config) => { dispatch(configActions.loadConfig(config)) },
    handleLoadAllWords: (words) => { dispatch(wordActions.loadAllWords(words)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);