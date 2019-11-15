import React from 'react';
import Page from '../../components/page';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../styles/styles';


@inject("store")
@observer
class FollowingPage extends Page {

	constructor() {
		super()
		this.state = {
		}
	}

	render() {
		return <View style={styles.container}>
			<Text style={styles.text.title}>
				[FOLLOWING PAGE]
			</Text>
		</View>
	}

}

export default FollowingPage;