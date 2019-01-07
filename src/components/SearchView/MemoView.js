import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native'

import { CardView } from '../Share'

export default class MemoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memos: this.props.item.memos.map(memoObj => ({ ...memoObj }))
    }
  }

  _addMemo = (memo) => {
    const memos = [...this.state.memos]
    memos.push({ ...memo });
    this.props.saveEditMemo(memos)
    this.setState({ memos, })
  }

  _saveMemo = (memo, index) => {
    const memos = [...this.state.memos]
    memos[index] = memo
    this.props.saveEditMemo(memos)
    this.setState({ memos: [...memos] })
  }

  _removeMemo = (index) => {
    Alert.alert('삭 제', '해당 메모를 삭제하시겠습니까?', [
      {
        text: 'Yes', onPress: () => {
          const memos = [...this.state.memos]
          memos.splice(index, 1);
          this.props.saveEditMemo(memos);
          this.setState({ memos: [...memos] })
        }
      },
      {
        text: 'No', onPress: null,
      }
    ])
    
  }

  render() {
    const memos = this.state.memos.map(memoObj => ({ ...memoObj }))
    memos.map((memo, index) => memo.key = index.toString())
    return (
      <View style={{ flexDirection: 'column', marginBottom: 20}}>
        <FlatList
          data={memos}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index }) => (
            <MemoCard
              memo={item}
              saveMemo={(memo) => this._saveMemo(memo, index)}
              removeMemo={() => this._removeMemo(index)}
            />
          )}
        />
        <AddMemo
          addMemo={this._addMemo}
        />
      </View>
    )
  }
}

class AddMemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
    }
  }

  _addMemo = (memo) => {
    this.props.addMemo(memo);
    this.setState({ isAdding: false })
  }

  render() {
    return (
      <View>
        {!this.state.isAdding
          ? <CardView style={{ justifyContent: 'center', alignItems: 'center', height: 80 }}
            onPress={() => this.setState({ isAdding: true })}>
            <Image style={{ height: 25, width: 25 }}
              source={require('../../../assets/icons/icon_add.png')}
            />
          </CardView>
          : <MemoCard
            isEditing={true}
            saveMemo={this._addMemo}
            cancelEdit={() => this.setState({ isAdding: false })}
          />
        }
      </View>
    );
  }
}

class MemoCard extends Component {
  constructor(props) {
    super(props);
    const memo = this.props.memo || {
      title: 'memo',
      contents: [{ content: '' },],
      updateDate: null,
    }
    const isEditing = this.props.isEditing || false;
    this.state = {
      isEditing,
      memo: { ...memo }
    }
  }

  componentWillReceiveProps = () => {
    const memo = this.props.memo || {
      title: 'memo',
      contents: [{ content: '' },],
      updateDate: null,
    }
    this.setState({ memo: { ...memo } })
  }

  _removeContent = (index, ) => {
    const memo = { ...this.state.memo }
    memo.contents.splice(index, 1);
    this.setState({ memo, })
  }

  _addContent = () => {
    const contents = this.state.memo.contents.map(content => ({...content}))
    contents.push({ content: '' });
    this.setState({ memo: {...this.state.memo, contents}})
  }

  _cancelEdit = () => {
    this.setState({ isEditing: false, memo: { ...this.props.memo } })
  }

  _saveMemo = () => {
    Alert.alert('저 장', '메모를 저장(추가)하시겠습니까?', [
      {
        text: 'Yes', onPress: () => {
          const memo = { ...this.state.memo }
          memo.updateDate = new Date();
          this.props.saveMemo(memo);
          this.setState({ isEditing: false, memo, })
        }
      }, 
      {
        text: 'No', onPress: null,
      }
    ])

  }

  _changeEditMode = () => {
    this.setState({ isEditing: true, })
  }

  render() {
    const contents = this.state.memo.contents.map(contentObj => ({ ...contentObj }));
    contents.map((obj, index) => obj.key = index.toString());
    return (
      <CardView style={{ flexDirection: 'column', padding: 0, paddingBottom: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', height: 50, backgroundColor: '#FFFADF', borderTopLeftRadius: 10, borderTopRightRadius: 10, }}>
          <TextInput style={[{ flex: 1, padding: 15, }, { fontSize: 20, fontWeight: 'bold' }]}
            placeholder='Title (default : memo)'
            onChangeText={title => this.setState({ memo: { ...this.state.memo, title, } })}
            value={this.state.memo.title}
            editable={this.state.isEditing}
            autoCorrect={false}
            autoCapitalize={'none'} />
          {this.state.isEditing
            ? <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 15 }}>
              <TouchableOpacity onPress={this._saveMemo}>
                <Image style={{ width: 22, height: 22, marginRight: 10 }} source={require('../../../assets/icons/edit_save.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.props.cancelEdit || this._cancelEdit}>
                <Image style={{ width: 22, height: 22 }} source={require('../../../assets/icons/edit_cancel.png')} />
              </TouchableOpacity>
            </View>
            : <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 15 }}>
              <TouchableOpacity onPress={this._changeEditMode}>
                <Image style={{ width: 22, height: 22, marginRight: 10 }} source={require('../../../assets/icons/memo_edit.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.props.removeMemo}>
                <Image style={{ width: 22, height: 22 }} source={require('../../../assets/icons/memo_delete.png')} />
              </TouchableOpacity>
            </View>
          }
        </View>
        <FlatList style={{ padding: 15, paddingBottom: 0, }}
          data={contents}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10 }}>
              {!this.state.isEditing ? null :
                <TouchableOpacity onPress={() => this._removeContent(index)}>
                  <Image style={{ width: 20, height: 20, marginTop: 5, marginRight: 10, }}
                    source={require('../../../assets/icons/edit_remove.png')} />
                </TouchableOpacity>
              }
              <TextInput style={[{ flex: 1, padding: 5 }, this.state.isEditing ? { borderWidth: 1, borderColor: '#EEEEEE' } : null]}
                editable={this.state.isEditing}
                placeholder='Content'
                autoCorrect={false}
                autoCapitalize={'none'}
                value={item.content}
                onChangeText={content => {
                  const contents = this.state.memo.contents.map(content => ({ ...content }));
                  contents[index].content = content
                  this.setState({ memo: { ...this.state.memo, contents } })
                }} />
            </View>
          )}
        />
        {!this.state.isEditing ? null :
          <TouchableOpacity style={{ paddingLeft: 15, paddingRight: 15, }}
            onPress={this._addContent}>
            <Image style={{ width: 20, height: 20 }} source={require('../../../assets/icons/edit_add.png')} />
          </TouchableOpacity>
        }
      </CardView>
    );
  }
}

const styles = StyleSheet.create({})
