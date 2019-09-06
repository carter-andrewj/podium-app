import React from 'react';
import Component from '../utils/component';

import { SafeAreaView } from 'react-navigation';
import { View, StatusBar } from 'react-native';

import styles from '../styles/styles';


class Screen extends Component {

	render() {
		return <SafeAreaView style={styles.statusBar}>
			<StatusBar barStyle="light-content" />
			<View style={this.props.style}>
				{this.props.children}
			</View>
		</SafeAreaView>
	}

}

export default Screen;