import React from 'react';
import Page from '../../components/page';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';

// import styles from '../../styles/styles';


@inject("store")
@observer
class SettingsPage extends Page {

	constructor() {
		super()
		this.state = {
		}
	}

	render() {
		return <View style={this.style.container}>
			<Text style={this.style.text.title}>
				[SETTINGS PAGE]
			</Text>
		</View>
	}

}

export default SettingsPage;