import React from 'react';
import Component from './component';

import { KeyboardAvoidingView, View, StatusBar, SafeAreaView } from 'react-native';

import KeyboardView from './keyboardView';
import TaskBar from './tasks/taskBar';

import styles from '../styles/styles';


class Screen extends Component {

	render() {
		return <SafeAreaView style={styles.statusBar}>

			<StatusBar barStyle="dark-content" />

			<KeyboardView
				style={this.props.style}
				offsetBottom={this.props.offsetBottom}>

				{this.props.children}

				{this.props.hideTasks ?
					null :
					<TaskBar />
				}

			</KeyboardView>

		</SafeAreaView>
	}

}

export default Screen;