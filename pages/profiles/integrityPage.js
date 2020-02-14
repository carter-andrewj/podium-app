import React from 'react';
import Page from '../../components/page';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';



@inject("store")
@observer
class IntegrityPage extends Page {

	constructor() {
		super()
		this.state = {
		}
	}

	render() {
		return <View style={this.style.container}>
			<Text style={this.style.text.title}>
				[INTEGRITY PAGE]
			</Text>
		</View>
	}

}

export default IntegrityPage;