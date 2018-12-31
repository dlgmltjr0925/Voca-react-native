import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'

import { CardView } from '../Share'

class ExamView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this._setData()
		}
		// alert(JSON.stringify(this.state.data))
	}

	shouldComponentUpdate() {
		const data = this._setData();
		this.setState({ data })
		return true;
	}

	_setData = () => {
		const data = [[], [], [], [], [], []]
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
			data[i].sort((a, b) => {
				return a.date > b.date ? -1 : a.date < b.date ? 1 : 0
			})
		}
		return data
	}


	render() {
		return (
			<View style={{ flex: 1, }}>

			</View>
		)
	}
}

const styles = StyleSheet.create({})

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