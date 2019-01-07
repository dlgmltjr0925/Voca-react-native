import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image, FlatList, TextInput, Alert } from 'react-native'

import { CardView } from '../Share';

export default class WordCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      means: this.props.item.means.map(meanObj => ({ ...meanObj })),
    }
  }

  componentWillReceiveProps = () => {
    this.setState({ isEditing: false })
  }

  _removeMean = (index) => {
    const means = [...this.state.means]
    if (means.length === 1) return Alert.alert('경 고', '최소 하나 이상의 의미가 필요합니다.', [{ text: '확  인' }])
    means.splice(index, 1);
    this.setState({ means : [...means] })
  }

  _addMean = () => {
    const means = [...this.state.means]
    means.push({mean: ''});
    this.setState({ means : [...means] })
  }

  _onChangeText = (mean, index) => {
    const means = [...this.state.means]
    means[index].mean = mean
    this.setState({ means, })
  }

  _saveEditMean = () => {
    const newMeans = []
    this.state.means.map(meanObj => {
      meanObj.mean = meanObj.mean.trim();
      if (meanObj.mean !== '') newMeans.push({...meanObj})
    })
    this.props.saveEditMean(newMeans)
    this.setState({means: newMeans})
  }

  render() {
    const fonts = this.props.config.fonts;
    const means = this.state.means
    means.forEach((mean, index) => mean.key = index.toString())
    return (
      <CardView style={{ flexDirection: 'column', }}
        activeOpacity={0.8}>
        <EditBar
          isEditing={this.state.isEditing}
          saveEditMean={this._saveEditMean}
          cancelEditMean={() => this.setState({ isEditing: false, means: this.props.item.means.map(meanObj => ({ ...meanObj })) })}
          editMean={() => this.setState({ isEditing: true })}
        />
        <Text style={[{ marginTop: 30, marginBottom: 50 }, fonts.cardWord2]}>{this.props.item.word}</Text>
        <View style={{ height: 1, backgroundColor: '#CCCCCC' }} />
        <FlatList style={{ marginTop: 20, }}
          data={means}
          keyExtractor={(item, index) => item.key}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 8 }}>
              <MeanView
                isEditing={this.state.isEditing}
                removeMean={() => this._removeMean(index)}
                index={index}
                onChangeText={(mean) => this._onChangeText(mean, index)}
                value={this.state.means[index].mean}
              />
            </View>
          )}
        />
        {!this.state.isEditing ? null :
          <AddView
            addMean={this._addMean}
          />
        }
      </CardView>
    )
  }
}

const EditBar = (props) => {
  if (props.isEditing) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity
          onPress={props.saveEditMean}>
          <Image style={{ width: 25, height: 25, marginRight: 10 }} source={require('../../../assets/icons/edit_save.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={props.cancelEditMean}>
          <Image style={{ width: 25, height: 25 }} source={require('../../../assets/icons/edit_cancel.png')} />
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ width: 25, height: 25, alignContent: 'flex-end', }}
          onPress={props.editMean}>
          <Image style={{ width: 20, height: 20 }} source={require('../../../assets/icons/card_edit.png')} />
        </TouchableOpacity>
      </View>
    )
  }
}

const MeanView = (props) => {
  const border = props.isEditing ? { borderWidth: 1, borderColor: '#EEEEEE' } : null;
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ width: 40, paddingLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
        {props.isEditing
          ? <TouchableOpacity onPress={props.removeMean}>
            <Image style={{ width: 22, height: 22 }} source={require('../../../assets/icons/edit_remove.png')} />
          </TouchableOpacity>
          : <Text style={[{ width: 22}, { fontSize: 20, fontWeight: 'bold' }]}>{props.index + 1}</Text>
        }
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TextInput style={[{ flex: 1, height: 30, marginRight: 20, padding: 5 }, { fontSize: 18 }, border]}
          onChangeText={mean => props.onChangeText(mean)}
          returnKeyType={'done'}
          editable={props.isEditing}
          value={props.value}>
        </TextInput>
      </View>
    </View>
  )
}

const AddView = (props) => (
  <View style={{ flex: 1, flexDirection: 'row', marginRight: 20, paddingTop: 5, paddingBottom: 20}}>
    <TouchableOpacity style={{ width: 40, paddingLeft: 10, justifyContent: 'center', alignItems: 'center' }}
      onPress={props.addMean}>
      <Image style={{ width: 22, height: 22 }} source={require('../../../assets/icons/edit_add.png')} />
    </TouchableOpacity>
  </View>
)


const styles = StyleSheet.create({})
