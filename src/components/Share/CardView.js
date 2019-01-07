import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

export default class CardView extends Component {
  render() {
    return (
      <TouchableOpacity style={[styles.container, this.props.style]}
        onPress={this.props.onPress}
        onPressIn={this.props.onPressIn}
        onPressOut={this.props.onPressOut}
        activeOpacity={this.props.activeOpacity || 0.8}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10, 
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#E0E0E0', 
    borderRadius: 10,
    padding: 15, 
  }
})
