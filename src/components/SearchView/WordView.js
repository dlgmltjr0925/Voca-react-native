import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image, FlatList, TextInput, Alert, AsyncStorage } from 'react-native'
import { configActions, wordActions } from '../../actions';
import { connect } from 'react-redux';

import { CardView } from '../Share'

class WordView extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: 'Word',
      headerStyle: {
        backgroundColor: '#FCFCFC',
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
    const item = this.props.navigation.state.params.item
    this.state = {
      item,
      word: item.word,
      means: item.means,
      memos: item.memos,
      isEditing: false,
    }
    this._deleteWord = this._deleteWord.bind(this)
    this.props.handleUpdateWord = this.props.handleUpdateWord.bind(this)
  }

  componentDidMount = () => {
    this.props.navigation.setParams({ deleteWord: this._deleteWord })
  }

  _onBlurMean = (event) => {
    Alert.alert('변 경', '변경된 내용을 저장하겠습니까?', [
      { text: 'Yes', onPress: () => this._saveWord() },
      { text: 'No', onPress: () => this.setState({ means: this.state.means }) }
    ])
  }

  _deleteWord = () => {
    const newWords = { ...this.props.words };
    delete newWords[this.state.word];
    AsyncStorage.removeItem('WORDS', (err) => {
      if (err) throw err;
      AsyncStorage.setItem('WORDS', JSON.stringify(newWords), (error) => {
        if (err) throw err;
        this.props.handleUpdateWord(newWords);
        this.props.navigation.goBack()
      })
    })
  }

  _removeMean = (index) => {
    const newMeans = [...this.state.means]
    newMeans.splice(index, 1)
    const newWords = { ...this.props.words }
    newWords[this.state.word].means = newMeans
    AsyncStorage.mergeItem('WORDS', JSON.stringify(newWords), (err) => {
      if (err) throw err
      this.props.handleUpdateWord(newWords)
      this.setState({ means: newMeans })
    })
  }

  _editMean = (index, mean) => {
    // alert(`index: ${index}, mean: ${mean}`)
    const newMeans = [...this.state.means]
    newMeans[index] = { mean }
    const newWords = { ...this.props.words }
    newWords[this.state.word].means = newMeans
    // alert(JSON.stringify(newWords))
    AsyncStorage.mergeItem('WORDS', JSON.stringify(newWords), (err) => {
      if (err) throw err
      this.props.handleUpdateWord(newWords)
    })
  }

  _saveEditMean = () => {
    const newWords = {...this.props.words}
    newWords[this.state.word].means = [...this.state.means]
    AsyncStorage.mergeItem('WORDS', JSON.stringify(newWords), (err) => {
      if (err) throw err;
      this.props.handleUpdateWord(newWords);
      this.setState({isEditing: false})
    })
  }

  _cancelEditMean = () => {
    this.setState({
      isEditing: false,
      means: this.props.words[this.state.word].means
    })
  }

  render() {
    const colors = this.props.config.colors;
    const styles = this.props.config.styles;
    const fonts = this.props.config.fonts;
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#FCFCFC' }}>
        <CardView style={{ flexDirection: 'column', }}
          activeOpacity={0.8}>
          {this.state.isEditing
            ? <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={this._saveEditMean}>
                <Image style={{width: 20, height: 20, marginRight: 10}} source={require('../../../assets/icons/edit_save.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this._cancelEditMean}>
                <Image style={{width: 20, height: 20}} source={require('../../../assets/icons/edit_cancel.png')} />
              </TouchableOpacity>
            </View>
            : <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={{ width: 20, height: 20, alignContent: 'flex-end', }}
                onPress={() => this.setState({ isEditing: true })}>
                <Image style={{ width: 20, height: 20 }} source={require('../../../assets/icons/card_edit.png')} />
              </TouchableOpacity>
            </View>
          }
          <Text style={[{ marginTop: 30, marginBottom: 50 }, fonts.cardWord2]}>{this.state.word}</Text>
          <View style={{ height: 1, backgroundColor: '#CCCCCC' }} />
          <FlatList style={{ marginTop: 20, }}
            data={this.state.means}
            keyExtractor={(item) => item.mean}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 8 }}>
                <MeanInput
                  remove={() => this._removeMean(index)}
                  edit={(mean) => this._editMean(index, mean)}
                  index={index}>
                  {item.mean}
                </MeanInput>
              </View>
            )}
          />
        </CardView>
      </View>
    )
  }
}

class MeanInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      preMean: this.props.children,
      mean: this.props.children,
    }
  }

  _cancle = () => {
    this.setState({
      isEditing: false,
      mean: this.state.preMean
    })
  }

  _save = () => {
    this.props.edit(this.state.mean)
    this._cancle()
  }

  render() {
    const line = this.state.isEditing ? { borderWidth: 1, borderColor: '#EEEEEE' } : null
    const index = this.props.index
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: 40, paddingLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
          {this.state.isEditing
            ? <TouchableOpacity onPress={this.props.remove}>
              <Image style={{ width: 22, height: 22 }} source={require('../../../assets/icons/edit_remove.png')} />
            </TouchableOpacity>
            : <Text style={[{ width: 20, }, { fontSize: 20, fontWeight: 'bold' }]}>{index + 1}</Text>
          }
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TextInput style={[{ flex: 1, marginRight: 20 }, { fontSize: 18 }, line]}
            onChangeText={mean => this.setState({ mean })}
            onFocus={() => { this.setState({ isEditing: true, preMean: this.state.mean }) }}
            returnKeyType={'done'}
            onSubmitEditing={this._save}>
            {this.props.children}
          </TextInput>
          {!this.state.isEditing ? null :
            <View style={{ flexDirection: 'row', width: 40, justifyContent: 'flex-end', alignItems: 'center' }}>
              <TouchableOpacity style={{ paddingRight: 5, }} onPress={this._save}>
                <Image style={{ width: 22, height: 22 }} source={require('../../../assets/icons/edit_save.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ isEditing: false, mean: this.state.preMean })}>
                <Image style={{ width: 22, height: 22 }} source={require('../../../assets/icons/edit_cancel.png')} />
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
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