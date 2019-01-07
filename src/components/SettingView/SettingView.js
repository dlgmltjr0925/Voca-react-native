import React, { Component } from 'react'
import { Text, StyleSheet, View, AsyncStorage, ScrollView, TouchableOpacity, Alert, Picker } from 'react-native'
import { connect } from "react-redux";

import { configActions, wordActions } from '../../actions'
import { Header } from '../Share'
import { baseConfig, getInitConfig } from '../../../config'

const initConfig = JSON.stringify({...baseConfig})

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
      {
        text: 'Yes', onPress: async () => {
          const newWords = {}
          await AsyncStorage.removeItem('WORDS')
          await AsyncStorage.setItem('WORDS', JSON.stringify(newWords))
          this.props.handleUpdateWord(newWords)
        }
      },
      { text: 'No', }
    ])
  }

  _selectExamCount = () => {
    const count = []
    for (let i = 10; i <= 50; i += 5) {
      count.push({
        text: this.props.config.exam.examCount === i ? `${i}(선택)` : `${i}`,
        onPress: async () => {
          const config = { ...this.props.config };
          config.exam.examCount = i;
          await AsyncStorage.mergeItem('CONFIG', JSON.stringify(config));
          this.props.handleUpdateConfig(config);
        }
      })
    }
    Alert.alert('시험 데이터 수정', '', count)
  }

  _selectHighLevel = () => {
    const level = []
    for (let i = this.props.config.exam.lowLevel; i <= 5; i++) {
      level.push({
        text: this.props.config.exam.highLevel === i ? `${i}(선택)` : `${i}`,
        onPress: async () => {
          const config = { ...this.props.config }
          config.exam.highLevel = i;
          await AsyncStorage.mergeItem('CONFIG', JSON.stringify(config));
          this.props.handleUpdateConfig(config);
        }
      })
    }
    Alert.alert('High Level', '', level)
  }

  _selectLowLevel = () => {
    const level = []
    for (let i = 0; i <= this.props.config.exam.highLevel; i++) {
      level.push({
        text: this.props.config.exam.lowLevel === i ? `${i}(선택)` : `${i}`,
        onPress: async () => {
          const config = { ...this.props.config }
          config.exam.lowLevel = i;
          await AsyncStorage.mergeItem('CONFIG', JSON.stringify(config));
          this.props.handleUpdateConfig(config);
        }
      })
    }
    Alert.alert('Low Level', '', level)
  }

  _initConfig = async () => {
    Alert.alert('초기화', '설정된 정보를 초기화 하시겠습니까?', [
      {
        text: 'Yes', onPress: async () => {
          await AsyncStorage.removeItem('CONFIG');
          await AsyncStorage.setItem('CONFIG', initConfig);
          const config = JSON.parse(await AsyncStorage.getItem('CONFIG'));
          this.props.handleUpdateConfig(config);
        }
      },
      { text: 'No', }
    ])
  }

  render() {
    const style = this.props.config.styles
    return (
      <View style={[style.container]}>
        <Header style={[style.headerContainer, { marginTop: 5 }]}>
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Setting</Text>
        </Header>
        <ScrollView>
          <Text style={styles.title} >초기화</Text>
          <TouchableOpacity onPress={this._clearWord}>
            <Text style={[{ padding: 7, paddingLeft: 20, borderWidth: 1, borderColor: '#ECEBED' }, { fontSize: 15, fontWeight: 'bold', color: 'red' }]}>데이터 초기화</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._initConfig}>
            <Text style={[{ padding: 7, paddingLeft: 20, borderWidth: 1, borderColor: '#ECEBED' }, { fontSize: 15, fontWeight: 'bold', color: 'red' }]}>설정 초기화</Text>
          </TouchableOpacity>
          <Text style={styles.title} >Exam</Text>
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#ECEBED' }} onPress={this._selectExamCount}>
            <Text style={[{ padding: 7, paddingLeft: 20, }, { fontSize: 15, fontWeight: 'bold', color: 'black' }]}>시험 데이터 개수 수정</Text>
            <Text style={[{ padding: 7, paddingLeft: 20, }, { fontSize: 15, fontWeight: 'bold', color: 'black' }]}>{this.props.config.exam.examCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#ECEBED' }} onPress={this._selectLowLevel}>
            <Text style={[{ padding: 7, paddingLeft: 20, }, { fontSize: 15, fontWeight: 'bold', color: 'black' }]}>LowLevel 수정</Text>
            <Text style={[{ padding: 7, paddingLeft: 20, }, { fontSize: 15, fontWeight: 'bold', color: 'black' }]}>{this.props.config.exam.lowLevel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#ECEBED' }} onPress={this._selectHighLevel}>
            <Text style={[{ padding: 7, paddingLeft: 20, }, { fontSize: 15, fontWeight: 'bold', color: 'black' }]}>HighLevel 수정</Text>
            <Text style={[{ padding: 7, paddingLeft: 20, }, { fontSize: 15, fontWeight: 'bold', color: 'black' }]}>{this.props.config.exam.highLevel}</Text>
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
    marginTop: 20,
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
    handleUpdateWord: (newWords) => { dispatch(wordActions.updateWord(newWords)) },
    handleUpdateConfig: (config) => { dispatch(configActions.updateConfig(config)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingView)