import React, { Component } from 'react'
import { Platform, Text, StyleSheet, View } from 'react-native'

export default class Header extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: parseInt(Platform.Version, 10) >= 12 ? 32 : 20,
  }
})