import React from 'react';
import Component from '../../../components/component';
import { View, Text, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

import FadingView from '../../../components/animated/fadingView';
import Avatar from '../../../components/media/avatar';

import { formatAge, fromHex } from '../../../utils/utils';



@inject("store")
@observer
class Alert extends Component {

	constructor() {
		super({})
		this.link = this.link.bind(this)
	}


	get alert() {
		return this.props.alert
	}

	get user() {
		return this.nation.get("user", this.alert.from)
	}

	get text() {
		switch (this.alert.type) {

			// Followed alerts
			case "follow": return <Text
				numberOfLines={2}
				style={this.style.alerts.text}>
				<Text style={this.style.text.mention}>{this.user.alias}</Text>
				{` followed you`}
			</Text>

			// Mention alerts
			case "mention": return <Text style={this.style.alerts.text}>
				<Text style={this.style.text.mention}>{this.user.alias}</Text>
				{` mentioned you in a post`}
			</Text>

			// Mention alerts
			case "promote": return <Text style={this.style.alerts.text}>
				<Text style={this.style.text.mention}>{this.user.alias}</Text>
				{` promoted your post`}
			</Text>

			// Reply alerts
			case "reply": return <Text style={this.style.alerts.text}>
				<Text style={this.style.text.mention}>{this.user.alias}</Text>
				{` replied to you`}
			</Text>

			// Default
			default: return null

		}
	}


	link() {
		console.log("tapped alert")
	}


	render() {
		return <FadingView
			show={this.props.show}
			style={{
				...this.style.container,
				backgroundColor: this.alert.seen ?
					this.colors.white :
					fromHex(this.colors.major, 0.1)
			}}>
			<TouchableOpacity
				onPress={this.link}
				style={this.style.alerts.holder}>
				<Avatar
					style={this.style.alerts.avatar}
					corner="right"
					user={this.user}
				/>
				<View style={this.style.alerts.content}>
					{this.text}
					<View style={this.style.alerts.timeHolder}>
						<Text style={this.style.alerts.time}>
							{formatAge(this.alert.at)}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		</FadingView>
	}

}

export default Alert;