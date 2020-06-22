import React from 'react';
import Component from '../component';
import { Dimensions, Text, View, TouchableOpacity, Animated } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import Spinner from '../animated/spinner';



@inject("store")
@observer
export default class SquareButton extends Component {

	render() {

		let loading = this.props.loading || (!this.props.label && !this.props.icon)

		return <Animated.View style={[
				this.style.button.container,
				loading ?
					this.style.button.loading
					:
					{
						color: this.props.color || this.colors.neutralDark,
						backgroundColor: this.props.background || "transparent",
						borderColor: this.props.border || this.props.background || "transparent",
					},
				this.props.style
			]}>
			<TouchableOpacity
				style={this.style.container}
				onPress={!this.props.loading ? this.props.onPress : null}>
				{loading ?

					<Spinner
						size={this.layout.button.normal.iconSize}
						color={this.props.color || this.colors.neutralDark}
					/>

					:

					<Animated.View style={[this.style.container, this.props.contentStyle]}>

						{this.props.label ?
							<View style={this.style.button.overlay}>
								<Text style={[
										this.style.button.label,
										{
											color: this.props.color ||
												(this.props.style ? this.props.style.color : undefined) ||
												this.colors.neutralDark,
											backgroundColor: this.props.background || "transparent",
										},
										this.props.labelStyle
									]}>
									{this.props.label}
								</Text>
							</View>
							: null
						}

						{this.props.icon ?
							<View style={this.style.button.overlay}>
								<FontAwesomeIcon
									icon={this.props.icon}
									size={this.layout.button.normal.iconSize}
									color={this.props.color ||
										(this.props.style ? this.props.style.color : undefined) ||
										this.colors.neutralDark
									}
									style={{
										...this.style.button.icon,
										...this.props.iconStyle
									}}
								/>
							</View>
							: null
						}

						{this.props.overlay ?
							<View style={this.style.button.overlay}>
								{this.props.overlay}
							</View>
							: null
						}
						
					</Animated.View>
				}
			</TouchableOpacity>
		</Animated.View>
	
	}

}