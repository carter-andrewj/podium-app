import React from 'react';
import Page from '../../utils/page';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../styles/styles';


@inject("store")
@observer
class PostPage extends Page {

	constructor() {
		super()
		this.state = {
		}
	}

	render() {
		return <View style={styles.container}>
			<Text style={styles.text.title}>
				[POST PAGE]
			</Text>
		</View>
	}

}

export default PostPage;