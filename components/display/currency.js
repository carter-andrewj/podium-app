import React from 'react';
import Component from '../component';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import { formatNumber } from '../../utils/utils';



@inject("store")
@observer
export default class Currency extends Component {

	render() {

		// Ignore if no value provided
		if (!this.props.value && this.props.value !== 0) return null

		// Determine colours
		let tokenColor = this.colors[this.props.token || "pod"]
		let color = this.props.value > 0 ?
				tokenColor
			: this.props.value === 0 ?
				this.colors.neutralDark
			:
				this.colors.bad

		// Format value
		let value = this.props.precise ?
			this.props.value :
			formatNumber(this.props.value)

		return <View style={{
				...this.style.currency.container,
				...this.props.style,
			}}>
			<Text style={{
					...this.style.currency.text,
					color
				}}>
				{`${(this.props.delta && this.props.value > 0) ? "+" : ""}${value} `}
			</Text>
			<FontAwesomeIcon
				icon="dot-circle"
				size={this.props.iconSize || this.style.currency.text.fontSize * 0.95}
				color={tokenColor}
				style={this.style.currency.icon}
			/>
		</View>

	}

}