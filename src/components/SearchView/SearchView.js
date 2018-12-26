import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'

export default class SearchView extends Component {
  render() {
    return (
      <View>
        <Text> Search </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  }
})
