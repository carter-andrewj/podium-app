import React from 'react';
import Component from '../component';
import { StyleSheet, Dimensions, Text, View,
		 TouchableOpacity, TouchableHighlight,
		 TouchableWithoutFeedback } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import styles from '../../styles/styles';
import settings from '../../settings';



export default class Button extends Component {


	get container() {
		switch (this.props.reaction) {
			case "opacity": return TouchableOpacity
			case "highlight": return TouchableHighlight
			default: return TouchableWithoutFeedback
		}
	}


	render() {

		let size;
		if (this.props.size) {
			size = Dimensions.get("window").width * 0.14 *
				this.props.size
		}

		let Container = this.container

		return <Container onPress={this.props.inactive ?
				this.props.onThunk :
				this.props.onPress
			}>
			<View
				style={[
					styles.container,
					this.props.size ?
						{
							minWidth: size,
							maxWidth: this.props.icon ? size : null,
							minHeight: size,
							maxHeight: size,
						}
						:
						{
							alignSelf: this.props.align || "stretch"
						},
					this.props.caption ?
						{
							transform: [{
								translateX: -0.03 * Dimensions.get("window").width
							}]
						}
						:
						{},
					{
						borderRadius: this.props.round ? (size || "100%") : 0.0,
						backgroundColor: this.props.color || settings.colors.white,
						opacity: this.props.visible === false ? 0.0 : 1.0
					},
					this.props.style
				]}>
				<View style={[styles.container, { width: "100%", height: "100%" }]}>
					{

					// Spinner
					this.props.loading ?
						<Spinner
							size={this.props.iconSize || size * 0.4 || settings.iconSize.medium}
							color={this.props.loadingColor || this.props.iconColor || settings.colors.neutral}
							style={this.props.loadingStyle || this.props.iconStyle || styles.text.wait }
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
							size={this.props.iconSize || size * 0.4 || settings.iconSize.medium}
							color={this.props.inactive ?
								this.props.iconColorOff || this.props.iconColor || settings.colors.bad
								:
								this.props.iconColorOn || this.props.iconColor || settings.colors.good	
							}
							style={[
								styles.button.icon,
								this.props.iconStyle,
								this.props.inactive ?
									this.props.styleOff || styles.text.bad
								:
									this.props.styleOn || styles.text.good	
							]}
						/>

					// Label
					:
						<Text style={[
								styles.button.text,
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
					{this.props.caption ?
						<View style={styles.button.caption}>
							<Text style={styles.button.captionText}>
								{this.props.caption}
							</Text>
						</View>
						: null
					}
				</View>
			</View>
		</Container>
	}

}
