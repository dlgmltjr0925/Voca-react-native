import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image, FlatList, TextInput, Alert, AsyncStorage, ScrollView } from 'react-native'
import { configActions, wordActions } from '../../actions';
import { connect } from 'react-redux';

import { CardView } from '../Share'
import WordCard from './WordCard'
import MemoView from './MemoView';

class WordView extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
    return {
      title: 'Word',
      headerStyle: {
        backgroundColor: '#FCFCFC'
      },
      headerTitleStyle: {
        fontSize: 22,
        fontWeight: 'bold'
      },
      headerRight: (
        <TouchableOpacity onPress={() => Alert.alert('삭 제', '단어를 삭제하시겠습니까?', [
          { text: 'Yes', onPress: navigation.getParam('deleteWord') },
          { text: 'No' }
        ])}>
          <Image style={{ width: 25, height: 25, marginRight: 10, }} source={require('../../../assets/icons/icon_remove.png')} />
        </TouchableOpacity>
      )
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.state.params.item
    };
    this._deleteWord = this._deleteWord.bind(this);
    this.props.handleUpdateWord = this.props.handleUpdateWord.bind(this)
  }

  componentDidMount = () => {
    this.props.navigation.setParams({ deleteWord: this._deleteWord })
  }

  componentWillReceiveProps = () => {
    // 단어 또는 메모가 수정되었을 경우 실행
    const word = this.props.words[this.state.item.word]
    const item = { ...this.state.item }
    item.means = word.means;
    item.memos = word.memos;
    this.setState({ item })
  }

  _deleteWord = async () => {
    const newWords = { ...this.props.words };
    delete newWords[this.state.item.word];
    try {
      await AsyncStorage.removeItem('WORDS');
      await AsyncStorage.setItem('WORDS', JSON.stringify(newWords))
      this.props.handleUpdateWord(newWords);
      this.props.navigation.goBack()
    } catch (error) {
      throw error
    }
  }

  _saveEditMean = async (means) => {
    const newWords = { ...this.props.words }
    newWords[this.state.item.word].means = means
    newWords[this.state.item.word].updateDate = new Date();
    try {
      await AsyncStorage.mergeItem('WORDS', JSON.stringify(newWords))
      this.props.handleUpdateWord(newWords);
    } catch (error) {
      throw error
    }
  }

  _saveEditMemo = async (memos) => {
    const newWords = { ...this.props.words }
    newWords[this.state.item.word].memos = memos
    newWords[this.state.item.word].updateDate = new Date();
    try {
      await AsyncStorage.mergeItem('WORDS', JSON.stringify(newWords))
      this.props.handleUpdateWord(newWords);
    } catch (error) {
      throw error
    }
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, flexDirection: 'column', backgroundColor: '#FCFCFC' }}>
        <WordCard
          item={this.state.item}
          config={this.props.config}
          saveEditMean={this._saveEditMean}
        />
        <MemoView
          item={this.state.item}
          saveEditMemo={this._saveEditMemo}
        />
      </ScrollView>
    )
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(WordView);