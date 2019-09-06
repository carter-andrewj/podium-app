import React from 'react';
import Component from '../utils/component';
import { StyleSheet, Dimensions, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import styles from '../styles/styles';
import settings from '../settings';



export default class Button extends Component {

	render() {

		let size;
		if (this.props.size) {
			size = Dimensions.get("window").width * 0.14 *
				this.props.size
		}

		return <View
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
					: {},
				{
					borderRadius: this.props.round ? (size || "100%") : 0.0,
					backgroundColor: this.props.color || settings.colors.white,
					opacity: this.props.visible === false ? false : true
				},
				this.props.style
			]}>
			<TouchableOpacity
				onPress={this.props.inactive ?
					this.props.onThunk :
					this.props.onPress
				}>
				<View style={[styles.container, { width: "100%", height: "100%" }]}>
					{this.props.icon ||
							(this.props.loading && this.props.iconLoad) ||
							(!this.props.inactive && this.props.iconOn) ||
							(this.props.inactive && this.props.iconOff) ?
						<FontAwesomeIcon
							icon={
								this.props.loading ?
									this.props.iconLoad || this.props.icon || "ellipsis-h"
								: !this.props.inactive ?
									this.props.iconOn || this.props.icon || "check"
								:
									this.props.iconOff || this.props.icon || "ban"
							}
							size={this.props.iconSize || size * 0.4 || settings.iconSize.medium}
							color={
								this.props.loading ?
									this.props.iconColorLoad || this.props.iconColor || settings.colors.neutral
								: !this.props.inactive ?
									this.props.iconColorOn || this.props.iconColor || settings.colors.good
								:
									this.props.iconColorOff || this.props.iconColor || settings.colors.bad
							}
							style={[
								styles.button.icon,
								this.props.iconStyle,
								this.props.loading ?
									this.props.styleLoad || styles.text.wait
								: !this.props.inactive ?
									this.props.styleOn || styles.text.good
								:
									this.props.styleOff || styles.text.bad
							]}
						/>
						:
						<Text style={[
								styles.button.text,
								this.props.labelStyle,
								this.props.loading ?
									this.props.styleLoad
								: !this.props.inactive ?
									this.props.styleOn
								:
									this.props.styleOff
							]}>
							{
								this.props.loading ?
									this.props.labelLoad || this.props.label || "LOADING"
								: !this.props.inactive ?
									this.props.labelOn || this.props.label || "BUTTON"
								:
									this.props.labelOff || this.props.label || "DISABLED"
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
			</TouchableOpacity>
		</View>
	}

}


// export class RoundStatefulButton extends Component {
// 	render() {
// 		return <TouchableOpacity onPress={this.props.active ? this.props.onPress : null}>
// 			<View style={[styles.card, buttonStyle.roundBox, this.props.style]}>
// 				{this.props.label ?
// 					<Text style={[buttonStyle.text, this.props.textStyle]}>
// 						{this.props.label || "BUTTON"}
// 					</Text>
// 					:
// 					<FontAwesomeIcon
// 						icon={
// 							this.props.active === undefined ?
// 								(this.props.iconNull || "ellipsis-h")
// 								:
// 								this.props.active ?
// 									(this.props.iconOn || "check")
// 									:
// 									(this.props.iconOff || "ban")
// 						}
// 						size={iconSize}
// 						color={
// 							this.props.active === undefined ?
// 								config.colors.neutral :
// 									this.props.active ?
// 										config.colors.good :
// 										config.colors.bad
// 						}
// 						style={[
// 							buttonStyle.icon,
// 							this.props.iconStyle,
// 							this.props.active === undefined ?
// 								styles.text.wait :
// 								this.props.active ?
// 									styles.text.good :
// 									styles.text.bad
// 						]}
// 					/>
// 				}
// 			</View>
// 		</TouchableOpacity>
// 	}
// }