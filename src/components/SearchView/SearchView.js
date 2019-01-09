import React, { Component } from 'react'
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Image, WebView, Alert, AsyncStorage, FlatList, KeyboardAvoidingView, Switch } from 'react-native'
import { connect } from 'react-redux';

import Header from './Header'
import { configActions, wordActions } from '../../actions'
import { CardView } from '../Share';

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
      webUri: '',
      preWebUri: '', 
    }
  }

  componentWillReceiveProps = () => {
    alert
    this.setState({ words: this.props.words })
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
    this.setState({ searchBar: { ...this.state.searchBar, isShowAddWord } })
  }

  _onChangeWord = word => {
    if (!this.state.searchBar.isShowAddWord) this.setState({ searchBar: { ...this.state.searchBar, word }, webUri: '' })
    else this.setState({ searchBar: { ...this.state.searchBar, word } })
  }

  // 네이버 사전에 단어를 검색
  _searchWebView = () => {
    const webUri = 'https://m.search.naver.com/search.naver?query=' + this.state.searchBar.word + '&where=m_ldic&sm=msv_hty';
    this.setState({ webUri, preWebUri: webUri })
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
      let content = ``
      newWords[word].means.map((obj, index) => content += `${index + 1}. ${obj.mean}\n`)
      Alert.alert(`${word}`, `${content}\n 기존에 등록된 단어가 있습니다. \n단어의 뜻을 변경하시겠습니까?`,
        [
          {
            text: '추  가', onPress: () => {
              newWords[word].means.forEach(mean => means.push(mean))
              newWords[word] = {
                ...newWords[word], means,
                updateDate: now,
                level: newWords[word].level < 3 ? 3 : newWords[word].level
              }
              this._saveWordToStore(newWords)
            }
          },
          {
            text: `대  체`, onPress: () => {
              newWords[word] = {
                ...newWords[word], means,
                updateDate: now,
                level: newWords[word].level < 3 ? 3 : newWords[word].level
              }
              this._saveWordToStore(newWords)
            }
          },
          {
            text: '취  소', onPress: null
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
  }

  _saveWordToStore = async (newWords) => {
    this.props.handleUpdateWord(newWords);
    await AsyncStorage.mergeItem('WORDS', JSON.stringify(newWords));
    this._clearAddWord('')
  }

  _clearAddWord = (webUri = this.state.webUri) => {
    this.inputs['word'].clear();
    this.inputs['mean'].clear();
    this.inputs['word'].focus();
    this.setState({
      searchBar: {
        ...this.state.searchBar,
        word: '',
        mean: '',
      },
      webUri,
    })
  }

  _getWordContent = () => {
    const contents = []
    const regExp = new RegExp(this.state.searchBar.word);
    const keys = Object.keys(this.props.words);
    keys.forEach(word => {
      let content = null;
      if (regExp.test(word)) {
        content = { ...this.props.words[word] }
      } else {
        const temp = { ...this.props.words[word] }
        temp.means.forEach(mean => { if (regExp.test(mean) && content !== temp) content = temp })
        temp.memos.forEach(memo => { if (regExp.test(memo) && content !== temp) content = temp })
      }
      if (content) {
        content['word'] = word
        contents.push(content)
      };
    });
    contents.sort((a, b) => {
      return a.updateDate > b.updateDate ? -1 : a.updateDate < b.updateDate ? 1 : 0
    })
    contents.forEach((word, index) => word['key'] = index.toString())
    // alert(JSON.stringify(contents))
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
        <FlatList style={{ flex: 1 }}
          data={contents}
          keyExtractor={(item, index) => item.key}
          renderItem={({ item }) => (
            <CardView style={{ flexDirection: 'column' }}
              onPress={() => {
                this.props.navigation.navigate('Word', {
                  item,
                })
              }}
              onLongPress={() => this.setState({ webUri: `https://m.search.naver.com/search.naver?query=${item.word}&where=m_ldic&sm=msv_hty` })}
            >
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
    return (
      <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.mainContainer }]} behavior="padding" enabled>
        <Header style={[styles.headerContainer, { flexDirection: 'column', justifyContent: 'flex-start' },]}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TextInput style={styles.searchBar}
              placeholder={!searchBar.isShowAddWord ? searchBar.placeholder1 : searchBar.placeholder2}
              clearButtonMode={'while-editing'}
              returnKeyType={!searchBar.isShowAddWord ? 'search' : 'next'}
              blurOnSubmit={true}
              autoCorrect={false}
              autoCapitalize={'none'}
              onChangeText={this._onChangeWord}
              onSubmitEditing={!searchBar.isShowAddWord ? this._searchWebView : () => { this._searchWebView(); this.inputs['mean'].focus() }}
              // value={this.state.searchBar.word}
              ref={input => this.inputs['word'] = input}
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
              <TextInput style={[styles.searchBar, { flex: 0, height: 30 }]}
                placeholder={searchBar.placeholder3}
                clearButtonMode={'while-editing'}
                clearTextOnFocus={false}
                returnKeyType={'done'}
                autoCorrect={false}
                autoCapitalize={'none'}
                onChangeText={mean => this.setState({ searchBar: { ...this.state.searchBar, mean } })}
                onSubmitEditing={this._saveWord}
                // value={this.state.searchBar.mean}
                ref={input => this.inputs['mean'] = input}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center'}}>
                  <Text style={[{ marginLeft: 10, marginTop: 10, },]}>Web</Text>
                  <Switch style={{ marginBottom: -10, transform: [{ scaleX: .6 }, { scaleY: .6 }] }} 
                    value={this.state.webUri ? true : false}
                    onValueChange={() => {
                      if (this.state.webUri !== '') this.setState({webUri: ''})
                      else this.setState({webUri: this.state.preWebUri})
                    }}
                  />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
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
            </View>
          }
        </Header>
        <View style={{ flex: 1 }}>
          {this.state.webUri === '' ? <SearchStorageView /> : <SearchWebView source={{ uri: this.state.webUri }} />}
        </View>
      </KeyboardAvoidingView>
    )
  }
}

class SearchWebView extends Component {
  render() {
    return (
      <WebView style={{ flex: 1, }}
        source={this.props.source}
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