import React, { Component } from 'react'
import { Text, StyleSheet, View, AsyncStorage, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { connect } from "react-redux";
import { Header } from '../Share'

class SettingView extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  _clearWord = () => {
    Alert.alert('삭 제', '저장된 데이터를 모두 삭제하시겠습니까?', [
      { text: 'Yes', onPress: () => this._clearWordFromStorage()},
      { text: 'No', }
    ])
  }

  _clearWordFromStorage = async () => {
    const newWords = {}
    await AsyncStorage.removeItem('WORDS')
    await AsyncStorage.setItem('WORDS', JSON.stringify(newWords))
  }

  render() {
    const style = this.props.config.styles
    return (
      <View style={[style.container]}>
        <Header style={[style.headerContainer, {marginTop: 5}]}>
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Setting</Text>
        </Header>
        <ScrollView>
          <Text style={styles.title} >데이터</Text>
          <TouchableOpacity onPress={this._clearWord}>
            <Text style={[{ padding: 7, paddingLeft: 20, borderWidth: 1, borderColor: '#ECEBED' }, { fontSize: 15, fontWeight: 'bold', color: 'red' }]}>데이터 초기화</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    padding: 10,
    paddingLeft: 15,
    paddingBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',

  }
})



const mapStateToProps = state => {
  return {
    config: state.config.config,
    words: state.word.words
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleLoadConfig: (config) => { dispatch(configActions.loadConfig(config)) },
    handleUpdateWord: (newWords) => { dispatch(wordActions.updateWord(newWords)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingView)