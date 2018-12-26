/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import { Views } from './src/components'

const TabBarIcon = (props) => (<Image style={styles.tabBarIcon} source={props.source} />)

// 단어 검색 및 입력이 가능한 View
const SearchStack = createStackNavigator({
  Search: Views.SearchView
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

export default class App extends Component {
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
