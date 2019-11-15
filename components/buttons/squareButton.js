import React from 'react';
import Component from '../component';
import { Dimensions, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import styles from '../../styles/styles';
import settings from '../../settings';

import Spinner from '../animated/spinner';



export default class SquareButton extends Component {

	render() {

		const size = this.props.size || 1.0
		const iconSize = Math.round(Dimensions.get("window").width *
			settings.layout.buttonIcon * size)
		const labelSize = Math.round(styles.button.label.fontSize * size)

		// Scale button
		let container = styles.button.container
		if (size !== 1.0) {
			const scale = Math.round(styles.button.container.minHeight * size),
			container = {
				...styles.button.container,
				minWidth: scale,
				maxWidth: scale,
				minHeight: scale,
				maxHeight: scale,
			}
		}

		return <View style={[
				container,
				this.props.loading ?
					styles.button.loading
					:
					{
						color: this.props.color || settings.colors.white,
						backgroundColor: this.props.background ||
							settings.colors.major,
						borderColor: this.props.border ||
							this.props.background ||
							settings.colors.major,
					},
				this.props.style
			]}>
			<TouchableOpacity
				style={styles.container}
				onPress={!this.props.loading ? this.props.onPress : null}>
				{this.props.loading ?

					<Spinner size={iconSize} />

					:

					<View style={[styles.container, this.props.contentStyle]}>
						{this.props.label ?

							<Text style={[
									styles.button.label,
									{
										color: this.props.color,
										backgroundColor: this.props.background,
										fontSize: labelSize
									},
									this.props.labelStyle
								]}>
								{this.props.label}
							</Text>

							:

							<FontAwesomeIcon
								icon={this.props.icon || "bug"}
								size={iconSize}
								color={this.props.color || settings.colors.white}
								style={styles.button.icon}
							/>

						}
					</View>
				}
			</TouchableOpacity>
		</View>
	
	}

}