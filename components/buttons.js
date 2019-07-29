import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import styles from '../styles/styles';
import config from '../styles/constants';


const box = {
	flex: 0,
	alignItems: "center",
	justifyContent: "center",
	width: Dimensions.get("window").width * 0.46,
	height: Dimensions.get("window").width * 0.14,
	backgroundColor: config.colors.white,
	borderRadius: Dimensions.get("window").width * 0.14,
	margin: Dimensions.get("window").width * 0.02,
}

const buttonStyle = StyleSheet.create({
	box: box,
	roundBox: {
		...box,
		width: Dimensions.get("window").width * 0.14,
	},
	text: {
		...styles.text.title
	},
	icon: {
		color: config.colors.major
	}
})

const iconSize = 22


export class Button extends Component {
	render() {
		return <TouchableOpacity onPress={this.props.onPress}>
			<View style={[styles.card, buttonStyle.box, this.props.style]}>
				{this.props.icon ?
					<FontAwesomeIcon
						icon={this.props.icon}
						size={iconSize}
						color={config.colors.major}
						style={[buttonStyle.icon, this.props.iconStyle]}
					/>
					:
					<Text style={[buttonStyle.text, this.props.textStyle]}>
						{this.props.label || "BUTTON"}
					</Text>
				}
			</View>
		</TouchableOpacity>
	}
}


export class RoundButton extends Component {
	render() {
		return <TouchableOpacity onPress={this.props.onPress}>
			<View style={[styles.card, buttonStyle.roundBox, this.props.style]}>
				{this.props.icon ?
					<FontAwesomeIcon
						icon={this.props.icon}
						size={iconSize}
						color={config.colors.major}
						style={[buttonStyle.icon, this.props.iconStyle]}
					/>
					:
					<Text style={[buttonStyle.text, this.props.textStyle]}>
						{this.props.label || "BUTTON"}
					</Text>
				}
			</View>
		</TouchableOpacity>
	}
}


export class RoundStatefulButton extends Component {
	render() {
		return <TouchableOpacity onPress={this.props.active ? this.props.onPress : null}>
			<View style={[styles.card, buttonStyle.roundBox, this.props.style]}>
				{this.props.label ?
					<Text style={[buttonStyle.text, this.props.textStyle]}>
						{this.props.label || "BUTTON"}
					</Text>
					:
					<FontAwesomeIcon
						icon={
							this.props.active === undefined ?
								(this.props.iconNull || "ellipsis-h")
								:
								this.props.active ?
									(this.props.iconOn || "check")
									:
									(this.props.iconOff || "ban")
						}
						size={iconSize}
						color={
							this.props.active === undefined ?
								config.colors.neutral :
									this.props.active ?
										config.colors.good :
										config.colors.bad
						}
						style={[
							buttonStyle.icon,
							this.props.iconStyle,
							this.props.active === undefined ?
								styles.text.wait :
								this.props.active ?
									styles.text.good :
									styles.text.bad
						]}
					/>
				}
			</View>
		</TouchableOpacity>
	}
}