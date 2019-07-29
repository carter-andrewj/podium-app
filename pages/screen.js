import React from 'react';
import Component from '../utils/component';

import { SafeAreaView } from 'react-navigation';
import { View } from 'react-native';

import styles from '../styles/styles';


class Screen extends Component {

	render() {
		return <SafeAreaView style={styles.statusBar}>
			<View style={this.props.style}>
				{this.props.children}
			</View>
		</SafeAreaView>
	}

}

export default Screen;