import React from 'react';
import Component from '../component';
import { StyleSheet, Dimensions, Text, View,
		 TouchableOpacity, TouchableHighlight } from 'react-native';
import TouchableWithoutFeedback from '../inputs/touchableWithoutFeedback';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';




@inject("store")
@observer
export default class Button extends Component {


	get container() {
		switch (this.props.reaction) {
			case "none": return TouchableWithoutFeedback
			case "highlight": return TouchableHighlight
			default: return TouchableOpacity
		}
	}


	render() {

		let Container = this.container

		return <Container
			style={this.props.containerStyle}
			onPress={this.props.inactive ?
				this.props.onThunk :
				this.props.onPress
			}>
			<View style={{
					...this.style.button.container,
					backgroundColor: this.props.color || this.colors.white,
					opacity: this.props.visible === false ? 0.0 : 1.0,
					...this.props.style
				}}>
				<View style={{
						...this.style.container,
						width: "100%",
						height: "100%"
					}}>
					{

					// Spinner
					this.props.loading ?
						<Spinner
							size={this.props.iconSize || this.layout.button.normal.iconSize}
							color={this.props.loadingColor || this.props.iconColor || this.colors.neutral}
							style={this.props.loadingStyle || this.props.iconStyle }
						/>

					// Icon
					: this.props.icon ||
							(!this.props.inactive && this.props.iconOn) ||
							(this.props.inactive && this.props.iconOff) ?
						<FontAwesomeIcon
							icon={this.props.inactive ?
								this.props.iconOff || this.props.icon || "ban"
								:
								this.props.iconOn || this.props.icon || "check"
							}
							size={this.props.iconSize || this.layout.button.normal.iconSize}
							color={this.props.inactive ?
								this.props.iconColorOff || this.props.iconColor || this.colors.neutral
								:
								this.props.iconColorOn || this.props.iconColor || this.colors.major	
							}
							style={[
								this.style.button.icon,
								this.props.iconStyle,
								this.props.inactive ?
									this.props.styleOff || this.style.text.neutral
								:
									this.props.styleOn || this.style.text.good	
							]}
						/>

					// Label
					:
						<Text style={[
								this.style.button.text,
								this.props.labelStyle,
								this.props.inactive ? this.props.styleOff : this.props.styleOn
							]}>
							{this.props.inactive ?
								this.props.labelOff || this.props.label || "DISABLED"
								:
								this.props.labelOn || this.props.label || "BUTTON"	
							}
						</Text>

					}
				</View>
			</View>
		</Container>
	}

}
