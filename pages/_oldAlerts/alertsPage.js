import React from 'react';
import Page from '../../components/page';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../styles/styles';


@inject("store")
@observer
class AlertsPage extends Page {

	constructor() {
		super()

	}

	render() {
		return <View style={styles.container}>
			<Text style={styles.text.title}>
				[ALERTS PAGE]
			</Text>
		</View>
	}

}

export default AlertsPage;