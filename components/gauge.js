import React from 'react';
import Component from './component';
import { View, Text } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import styles from '../styles/styles';
import settings from '../settings';




export default class Gauge extends Component {

	render() {

		return <View style={styles.gauge.container}>
			<FontAwesomeIcon
				icon={this.props.icon}
				size={0.6}
				color={settings.colors.white}
			/>
			<Text style={styles.gauge.label}>
				{this.props.label}
			</Text>
		</View>
	
	}


}