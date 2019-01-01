import React, { Component } from 'react'
import { Text, StyleSheet, View, FlatList, TouchableOpacity, AsyncStorage, Image } from 'react-native'
import { configActions, wordActions } from '../../actions';
import { connect } from 'react-redux'

import { CardView, Header } from '../Share'

class ExamView extends Component {
	static navigationOptions = {
		header: null,
	}

	constructor(props) {
		super(props);
		this.state = {
			data: null,
			examData: null,
			examCount: this.props.config.examCount,
		}
		this.props.handleLoadConfig = this.props.handleLoadConfig.bind(this)
		this.props.handleUpdateWord = this.props.handleUpdateWord.bind(this)
	}

	componentWillMount() {
		this._setData();
	}

	componentWillReceiveProps() {
		this._setData();
	}

	_setData = () => {
		const data = [[], [], [], [], [], []];
		const examData = [];
		const keys = Object.keys(this.props.words)
		keys.forEach(word => {
			data[this.props.words[word].level].push({
				word,
				means: this.props.words[word].means,
				date: this.props.words[word].updateDate,
				level: this.props.words[word].level
			})
		})
		for (let i = 0; i < 6; i++) {
			if (i !== 0) {
				data[i].sort((a, b) => {
					return a.date > b.date ? -1 : a.date < b.date ? 1 : 0
				})
			} else {
				data[i].sort((a, b) => {
					return a.date < b.date ? -1 : a.date > b.date ? 1 : 0
				})
			}

		}
		for (let i = 5; i > -1; i--) {
			data[i].forEach((word) => examData.push(word));
		}
		examData.forEach((word, index) => word['key'] = index.toString())
		console.log(examData)
		this.setState({ data, examData })
	}

	_initExam = () => {
		this.setState({
			examCount: this.props.config.examCount
		})
	}

	_levelUp = (word) => {
		const newWords = { ...this.props.words }
		if (newWords[word].level !== 5) {
			newWords[word].level += 1;
		}
		newWords[word].updateDate = new Date();
		this._saveWordToStore(newWords).then(() => {
			if (this.state.examCount === 1 ||
				this.state.examData.slice(this.props.config.examCount - this.state.examCount, this.props.config.examCount).length === 1) this._initExam()
			else this.setState({ examCount: this.state.examCount - 1 })
		})
	}

	_levelDown = (word) => {
		const newWords = { ...this.props.words }
		if (newWords[word].level !== 0) {
			newWords[word].level -= 1;
		}
		newWords[word].updateDate = new Date();
		this._saveWordToStore(newWords);
	}

	_saveWordToStore = async (newWords) => {
		this.props.handleUpdateWord(newWords);
		await AsyncStorage.mergeItem('WORDS', JSON.stringify(newWords));
	}

	render() {
		const style = this.props.config.styles
		return (
			<View style={style.container}>
				<Header style={[style.headerContainer, { marginTop: 5, flexDirection: 'row', justifyContent: 'space-between' }]}>
					<View style={{ height: 30, width: 40}}/>
					<Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Exam</Text>
					<View style={{ height: 30, width: 40 }}>
						<TouchableOpacity style={{ flex: 1, padding: 10, paddingBottom: 0, marginRight: 10 }} onPress={this._initExam}>
							<Image style={{ width: 23, height: 23, }} source={require('../../../assets/icons/exam_refresh.png')} />
						</TouchableOpacity>
					</View>
				</Header>
				<FlatList
					data={this.state.examData.slice(this.props.config.examCount - this.state.examCount, this.props.config.examCount)}
					keyExtractor={(item) => item.key}
					renderItem={({ item }) => (
						<WordView
							fonts={this.props.config.fonts}
							colors={this.props.config.colors.level}
							levelUp={() => this._levelUp(item.word)}
							levelDown={() => this._levelDown(item.word)}
							item={item}
						/>
					)}
				/>
			</View>
		)
	}
}

class WordView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShowMean: false
		}
	}

	componentWillReceiveProps() {
		this.setState({ isShowMean: false })
	}

	_toggleShowMean = () => {
		this.setState({ isShowMean: this.state.isShowMean ? false : true })
	}

	_meansToString = (means) => {
		let mean = '';
		for (let i = 0; i < means.length; i++) {
			mean += `${i + 1}. ${means[i].mean},  `
		}
		return mean.slice(0, mean.length - 3)
	}

	render() {
		return (
			<CardView style={{ height: 100, flexDirection: 'row', justifyContent: 'space-between', padding: 0, paddingTop: 15, paddingBottom: 15 }}
				onPress={this._toggleShowMean}>
				<TouchableOpacity style={{ padding: 15 }} onPress={this.props.levelUp}>
					<Image style={{ width: 18, height: 18, }} source={require('../../../assets/icons/exam_level_up.png')} />
				</TouchableOpacity>
				<View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
					<View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
						<View style={{ width: 7, height: 7, marginRight: 5, borderRadius: 3.5, backgroundColor: this.props.colors[this.props.item.level] }} />
						<Text style={this.props.fonts.cardWord}>{this.props.item.word}</Text>
					</View>
					{!this.state.isShowMean ? null :
						<Text style={{ marginTop: 5, }} numberOfLines={2}>{this._meansToString(this.props.item.means)}</Text>
					}
				</View>
				<TouchableOpacity style={{ padding: 15, justifyContent: 'flex-end' }} onPress={this.props.levelDown}>
					<Image style={{ width: 18, height: 18, }} source={require('../../../assets/icons/exam_level_down.png')} />
				</TouchableOpacity>
			</CardView>
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

export default connect(mapStateToProps, mapDispatchToProps)(ExamView)