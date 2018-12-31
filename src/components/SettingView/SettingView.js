import React, { Component } from 'react'
import { Text, StyleSheet, View, AsyncStorage, Button } from 'react-native'

export default class SettingView extends Component {
  render() {
    return (
      <View>
        <Text> textInComponent </Text>
        <Button title='init words' onPress = {async () => await AsyncStorage.removeItem('WORDS')}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({})
