import React from 'react';
import Component from '../component';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import { formatPercentage, colorPercentage } from '../../utils/utils';



@inject("store")
@observer
export default class Gauge extends Component {

	render() {
		return <View style={{
				...this.style.gauge.container,
				backgroundColor: colorPercentage(
					this.props.value || 0.0,
					[this.colors.bad, this.colors.warn, this.colors.good]
				),
				opacity: this.props.hide ? 0.0 : 1.0,
				...this.props.style,
			}}>
			<FontAwesomeIcon
				icon={this.props.icon}
				size={this.props.iconSize}
				color={this.colors.white}
			/>
			<Text style={this.style.gauge.text}>
				{this.props.value ?
					formatPercentage(this.props.value, 0) :
					"??"
				}
			</Text>
		</View>
	}

}