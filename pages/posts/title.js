import React from 'react';
import Component from '../../components/component';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import Name from '../../components/display/name';



@inject("store")
@observer
export default class PostTitle extends Component {

	get author() {
		return this.props.post ? this.props.post.author : this.props.author
	}

	get icon() {
		switch (this.author.type) {
			case "user": return "user"
			case "bot": return "robot"
			case "topic": return "hashtag"
			case "domain": return "world"
			default: return "user"
		}
	}

	get age() {
		return <Text>
			<Text style={this.style.post.spacer}>
				{" |"}
			</Text>
			<Text style={this.style.post.age}>
				{` ${this.props.post.age}`}
			</Text>
		</Text>
	}


	render() {
		return <Name
			withAlias={true}
			user={this.author}
			tail={this.age}
		/>
	}

}