import React from 'react';
import Component from '../component';
import { Text, View, TouchableOpacity } from 'react-native';

import styles from '../../styles/styles';
import settings from '../../settings';



export class Input extends Component {

	constructor() {
		super()
		this.state = {
			value: ""
		}
	}

	get value() {
		return this.state.value;
	}

	render() {
		return <TouchableOpacity onPress={this.props.onPress}>
			<View style={[styles.button, this.props.style]}>
				<Text style={[styles.buttonText, this.props.textStyle]}>
					{this.props.label}
				</Text>
			</View>
		</TouchableOpacity>
	}

}


