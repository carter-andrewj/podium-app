import React from 'react';
import Component from '../component';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';



@inject("store")
@observer
export default class Name extends Component {

	get icon() {
		switch (this.props.user.role) {
			case "user": return "user"
			case "bot": return "robot"
			case "topic": return "hashtag"
			case "domain": return "world"
			default: return "user"
		}
	}

	render() {
		return <View style={{
				...this.style.post.titleHolder,
				...this.props.style,
			}}>
			{this.icon ?
				<FontAwesomeIcon
					icon={this.icon}
					color={this.colors.major}
					style={this.style.post.titleIcon}
				/>
				: null
			}
			<Text
				numberOfLines={1}
				style={this.props.post ? this.style.post.title : this.style.post.titleFull}>
				<Text style={this.style.post.name}>
					{` ${this.props.user.name} `}
				</Text>
				{this.props.withAlias ?
					<Text style={this.style.post.alias}>
						{this.props.user.label}
					</Text>
					: null
				}
				{this.props.tail}
			</Text>
		</View>
	}

}