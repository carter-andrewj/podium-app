import React from 'react';
import Component from '../component';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import Popup from './popup';


@inject("store")
@observer
export default class Explainer extends Component {

	render() {
		return <Popup title={this.props.title}>
			<View style={this.style.explainer.subtitleHolder}>
				<Text style={this.style.explainer.subtitle}>
					under construction
				</Text>
			</View>
			<View style={this.style.explainer.iconHolder}>
				<FontAwesomeIcon
					icon={this.props.icon}
					size={this.layout.iconSize}
					style={this.style.explainer.icon}
				/>
			</View>
			<View style={this.style.explainer.textHolder}>
				{this.props.children}
			</View>
		</Popup>
	}

}