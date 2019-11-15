import React from 'react';
import Component from '../component';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import styles from '../../styles/styles';
import settings from '../../settings';




export default class CheckBox extends Component {

	constructor() {
		super()
		this.state = {
			on: false
		}
		this.set = this.set.bind(this)
		this.toggle = this.toggle.bind(this)
	}

	componentWillMount() {
		this.set(this.props.value)
	}

	componentDidUpdate(lastProps) {
		if (lastProps.value !== this.props.value) {
			this.set(this.props.value)
		}
	}

	set(x) {
		this.updateState(state => state.set("on", x))
	}

	toggle() {
		this.updateState(
			state => state.update("on", x => !x),
			this.props.onChange ?
				() => this.props.onChange(this.state.on)
				: null
		)
	}

	render() {
		return <TouchableWithoutFeedback onPress={this.toggle}>
			<View style={[styles.input.checkbox, this.props.style]}>
				<FontAwesomeIcon
					icon="check"
					size={settings.iconSize.small}
					color={this.state.on ?
						this.props.color || settings.colors.black
						: "transparent"
					}
					style={[styles.input.check, this.props.iconStyle]}
				/>
			</View>
		</TouchableWithoutFeedback>
	}

}