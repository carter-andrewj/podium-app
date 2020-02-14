import React from 'react';
import Component from '../component';
import { Dimensions, Text, View, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import Spinner from '../animated/spinner';



@inject("store")
@observer
export default class CaptionButton extends Component {

	render() {

		let loading = this.props.loading || (!this.props.label && !this.props.icon)

		let containerStyle = loading ?
			{
				...this.style.captionButton.inner,
				...this.style.button.loading,
				...this.props.style
			}
			:
			{
				...this.style.captionButton.inner,
				color: this.props.color || this.colors.neutral,
				backgroundColor: this.props.background || this.colors.white,
				borderColor: this.props.border || this.props.background || this.colors.white,
				...this.props.style
			}
				
		return <TouchableOpacity
			style={this.style.captionButton.container}
			onPress={!this.props.loading ? this.props.onPress : null}>

			{loading ?

				<Spinner
					color={this.style.button.loading.color}
					size={this.layout.button.normal.iconSize}
					containerStyle={containerStyle}
				/>

				:

				<View style={{
						...containerStyle,
						alignItems: (this.props.captionPosition === "left") ? "flex-start" : "flex-end",
					}}>
					<FontAwesomeIcon
						icon={this.props.icon}
						size={this.layout.button.normal.iconSize}
						color={this.props.color || this.colors.neutral}
						style={this.style.button.icon}
					/>
				</View>
			}

			<View style={{
					...containerStyle,
					marginLeft: (this.props.captionPosition === "left") ? "auto" : 0,
					marginRight: (this.props.captionPosition === "right") ? "auto" : 0,
				}}>
				<Text style={{
						...this.style.captionButton.caption,
						color: this.props.color || this.colors.neutral
					}}>
					{loading ? "-" : this.props.caption}
				</Text>
			</View>

		</TouchableOpacity>

	}

}