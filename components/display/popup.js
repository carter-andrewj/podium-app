import React from 'react';
import Component from '../component';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import { formatPercentage, colorPercentage } from '../../utils/utils';



@inject("store")
@observer
export default class Popup extends Component {

	render() {
		return <View style={this.style.popup.container}>

			<View style={this.style.popup.card}>

				{this.props.title ?
					<View style={this.style.popup.titleHolder}>
						<Text style={this.style.popup.title}>
							{this.props.title}
						</Text>
					</View>
					: null
				}

				<View style={this.style.popup.body}>
					{this.props.children}
				</View>

			</View>

		</View>
	}

}