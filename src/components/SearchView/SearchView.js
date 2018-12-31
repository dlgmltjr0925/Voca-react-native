import React, { Component } from 'react'
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Image, WebView, Alert, AsyncStorage, FlatList } from 'react-native'
import { connect } from 'react-redux';
import { StackNavigator } from 'react-navigation'

import Header from './Header'
import { configActions, wordActions } from '../../actions'
import { CardView } from '../Share';
import WordView from './WordView';

const initWord = {
  means: [],
  memos: [],
  level: 3,
  pronounce: ['', ''],
  registerDate: '',
  updateDate: '',
}

class SearchView extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.inputs = {};
    this.props.handleLoadConfig = this.props.handleLoadConfig.bind(this);
    this.props.handleUpdateWord = this.props.handleUpdateWord.bind(this);
    this.state = {
      words: this.props.words,
      searchBar: {
        placeholder1: '검색 할 단어를 입력하세요.',
        placeholder2: '저장 할 단어를 입력하세요.',
        placeholder3: '뜻을 입력하세요.',
        searchWord: '',
        word: '',
        mean: '',
        isShowAddWord: false,
      },
      webURI: '',
      isShowWebResult: false
    }
  }

  componentWillMount() {
    // if (Object.keys(this.props.words).length > 0) this.print(this.props.words)
    // this._getWordContent()
  }

  print = (obj) => {
    if (typeof obj === 'object') alert(JSON.stringify(obj))
    else alert(obj)
  }

  _focusNextField = (key) => {
    this.inputs[key].focus();
  }

  _openAddWord = () => {
    const isShowAddWord = this.state.searchBar.isShowAddWord ? false : true;
    this.setState({
      ...this.state,
      searchBar: {
        ...this.state.searchBar,
        isShowAddWord,
      }
    });
  }

  // 네이버 사전에 단어를 검색
  _searchWebView = (searchWord) => {
    const webURI = 'https://m.search.naver.com/search.naver?query=' + searchWord + '&where=m_ldic&sm=msv_hty';
    this.setState({ webURI })
  }

  // 단어를 저장
  _saveWord = async () => {
    if (this.state.searchBar.word === '') {
      this.inputs['word'].focus();
      return alert('단어를 입력하세요.')
    } else if (this.state.searchBar.mean === '') {
      alert('뜻을 입력하세요.')
      return this.inputs['mean'].focus();
    }
    const newWords = { ...this.props.words };
    const word = this.state.searchBar.word.trim();
    let mean = this.state.searchBar.mean.trim().split('  ')
    const means = []
    mean.forEach((mean) => means.push({ mean }))
    let isChanged = true;
    const now = new Date()
    if (newWords[word] !== undefined) {
      // 이미 등록된 단어일 경우
      Alert.alert('단어 수정', '기존에 등록된 단어가 있습니다. \n단어의 뜻을 "수정"하시겠습니까? \n단어의 뜻에 "추가"하시겠습니까?',
        [
          {
            text: '수 정', onPress: () => {
              newWords[word] = {
                ...newWords[word], means,
                updateDate: now
              }
              this._saveWordToStore(newWords)
            }
          },
          {
            text: '추 가', onPress: () => {
              means.forEach(mean => newWords[word].means.push(mean))
              this._saveWordToStore(newWords)
            }
          }
        ])
    } else {
      // 새로 등록하는 단어일 경우
      Alert.alert('단어 추가', `추가하시려는 단어가 ${word}가 맞습니까?`,
        [{
          text: 'Yes', onPress: () => {
            newWords[word] = {
              ...initWord, means,
              registerDate: now,
              updateDate: now
            }
            this._saveWordToStore(newWords)
          }
        },
        { text: 'No', onPress: () => isChanged = false }
        ])
    }
    if (isChanged) {

    }
  }

  // 단어 저장을 취소 함 (Add 초기화) 
  _saveWordToStore = async (newWords) => {
    this.props.handleUpdateWord(newWords);
    await AsyncStorage.mergeItem('WORDS', JSON.stringify(newWords));
    this._clearAddWord()
  }

  _clearAddWord = () => {
    this.inputs['word'].clear();
    this.inputs['mean'].clear();
    this.inputs['word'].focus();
    this.setState({
      searchBar: {
        ...this.state.searchBar,
        word: '',
        mean: ''
      }
    })
  }

  // onChangeTextWord
  _onChangeTextWord = (word) => {
    // if (this.)
    // if (this.state.isShow) this.setState({ ...this.state, searchBar: { ...this.state.searchBar, word, isShowAddWord: false } })
    // else this.setState({ ...this.state, searchBar: { ...this.state.searchBar, word } })
  }

  // onChangeTextMean
  _onChangeTextMean = (mean) => {
    this.setState({ ...this.state, searchBar: { ...this.state.searchBar, mean } })
  }

  // 
  _getWordContent = () => {
    const contents = []
    const reg = new RegExp(this.state.searchBar.word);
    const keys = Object.keys(this.props.words);
    keys.forEach(word => {
      let content = null;
      if (reg.test(word)) {
        content = { ...this.props.words[word] }
      } else {
        const temp = { ...this.props.words[word] }
        temp.means.forEach(mean => { if (reg.test(mean) && content !== temp) content = temp })
        temp.memos.forEach(memo => { if (req.test(memo) && content !== temp) content = temp })
      }
      if (content) {
        content['word'] = word
        contents.push(content)
      };
    });
    return contents;
  }

  render() {
    const colors = this.props.config.colors;
    const styles = this.props.config.styles;
    const fonts = this.props.config.fonts;
    const searchBar = this.state.searchBar;
    const Level = (props) => (
      <View style={{ flexDirection: 'row', }}>
        <View style={[styles.circle, { backgroundColor: props.level < 1 ? colors.level[0] : colors.level[1] }]} />
        <View style={[styles.circle, { backgroundColor: props.level < 2 ? colors.level[0] : colors.level[2] }]} />
        <View style={[styles.circle, { backgroundColor: props.level < 3 ? colors.level[0] : colors.level[3] }]} />
        <View style={[styles.circle, { backgroundColor: props.level < 4 ? colors.level[0] : colors.level[4] }]} />
        <View style={[styles.circle, { backgroundColor: props.level < 5 ? colors.level[0] : colors.level[5] }]} />
      </View>
    )
    const SearchStorageView = (props) => {
      const contents = this._getWordContent();
      return (
        <FlatList
          data={contents}
          keyExtractor={(item, index) => item.word}
          renderItem={({ item }) => (
            <CardView style={{ flexDirection: 'column' }}
              onPress={() => {
                this.props.navigation.navigate('Word', {
                  item,
                })
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[{ marginBottom: 10, }, fonts.cardWord]}>{item.word}</Text>
                <Level level={item.level} />
              </View>
              {item.means[0] ? <View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 18, fontWeight: 'bold' }}>1. </Text><Text style={{ fontSize: 18 }}>{item.means[0].mean}</Text></View> : null}
              {item.means[1] ? <View style={{ flexDirection: 'row', marginTop: 5 }}><Text style={{ fontSize: 18, fontWeight: 'bold' }}>2. </Text><Text style={{ fontSize: 18 }}>{item.means[1].mean}</Text></View> : null}
            </CardView>
          )}
        />
      )
    }
    const SearchWebView = (props) => {
      const uri = this.state.webURI
      return (
        <WebView style={{ flex: 1, }} source={{ uri }} />
      )
    }
    return (
      <View style={[styles.container, { backgroundColor: colors.mainContainer }]}>
        <Header style={[styles.headerContainer, { flexDirection: 'column', justifyContent: 'flex-start' },]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <WordInput style={styles.searchBar}
              placeholder={!searchBar.isShowAddWord ? searchBar.placeholder1 : searchBar.placeholder2}
              returnKeyType={!searchBar.isShowAddWord ? 'search' : 'next'}
              onSubmitEditing={!searchBar.isShowAddWord ? this._searchWebView : () => this.inputs['mean'].focus()}
              reference={input => this.inputs['word'] = input}
            />
            <TouchableOpacity style={{ paddingTop: 10, marginRight: 10, flexDirection: 'column', justifyContent: 'center' }}
              onPress={this._openAddWord}>
              {searchBar.isShowAddWord
                ? <Image style={{ width: 25, height: 25 }} source={require('../../../assets/icons/icon_minus_30.png')} />
                : <Image style={{ width: 25, height: 25 }} source={require('../../../assets/icons/icon_plus_30.png')} />
              }
            </TouchableOpacity>
          </View>
          {!searchBar.isShowAddWord ? null :
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
              <TextInput style={[styles.searchBar, { flex: 0, height: 30, }]}
                placeholder={searchBar.placeholder3}
                clearButtonMode={'while-editing'}
                clearTextOnFocus={false}
                returnKeyType={'done'}
                autoCorrect={false}
                autoCapitalize={'none'}
                onChangeText={this._onChangeTextMean}
                onSubmitEditing={this._saveWord}
                ref={input => this.inputs['mean'] = input}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 }}>
                <TouchableOpacity onPress={this._saveWord}>
                  <Text style={[{ paddingRight: 10, }, fonts.saveButton]}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this._clearAddWord()
                  this.setState({ searchBar: { ...this.state.searchBar, isShowAddWord: false } })
                }}>
                  <Text style={[{ paddingRight: 10, }, fonts.cancelButton]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        </Header>
        <View style={{ flex: 1 }}>
          {this.state.webURI === '' ? <SearchStorageView /> : <SearchWebView />}
        </View>
      </View>
    )
  }
}

class WordInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: '',
    }
  }
  render() {
    return (
      <TextInput style={this.props.style}
        placeholder={this.props.placeholder}
        clearButtonMode={'while-editing'}
        returnKeyType={this.props.returnKeyType}
        blurOnSubmit={false}
        autoCorrect={false}
        autoCapitalize={'none'}
        onChangeText={word => this.setState({ word })}
        onSubmitEditing={() => this.props.onSubmitEditing(this.state.word)}
        ref={input => this.props.reference(input)}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchView)