import React from 'react';
import Component from '../component';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import Spinner from '../animated/spinner';




@inject("store")
@observer
export default class MenuButton extends Component {

	constructor() {
		super()
		this.press = this.press.bind(this)
	}

	press() {
		if (this.props.inactive && this.props.onThunk) {
			this.props.onThunk()
		} else if (this.props.onPress) {
			this.props.onPress()
		}
	}


	get caption() {
		return <View style={this.style.menuButton.caption}>
			<Text
				numberOfLines={1}
				style={{
					...this.style.menuButton.text,
					textAlign: this.props.position === "left" ? "right" : "left",
				}}>
				{this.props.caption || 0}
			</Text>
		</View>
	}


	render() {

		// Render
		return <TouchableOpacity onPress={this.press}>
			<View style={{
					...this.style.menuButton.container,
					...this.props.style
				}}>

				{this.props.position === "left" ? this.caption : null}

				<View style={this.style.menuButton.icon}>
					<FontAwesomeIcon
						icon={this.props.icon}
						size={this.props.size || this.style.font.size.largest}
						color={this.props.color || this.colors.neutralDarkest}
						style={this.props.iconStyle || this.style.button.icon}
					/>
					{this.props.title ?
						<Text
							numberOfLines={1}
							style={{
								...this.style.menuButton.title,
								color: this.props.color || this.colors.neutralDarkest,
							}}>
							{this.props.title}
						</Text>
						: null
					}
				</View>

				{this.props.position !== "left" ? this.caption : null}

			</View>
		</TouchableOpacity>
	}

}

