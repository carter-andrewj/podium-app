import React from 'react';
import Page from '../../components/page';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';

import Post from './post';


@inject("store")
@observer
class PostPage extends Page {

	constructor() {
		super()
		this.state = {
		}
	}

	render() {
		return <View style={this.style.container}>
			<Post
				address={address}
				index={0}
				animator={this.animator}
			/>
		</View>
	}

}

export default PostPage;