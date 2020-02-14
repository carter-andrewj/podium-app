import React from 'react';
import Component from '../component';
import { View, TouchableWithoutFeedback as BrokenNativeTouchableWithoutFeedback } from 'react-native';




export default class TouchableWithoutFeedback extends Component {

	render() {
		return <BrokenNativeTouchableWithoutFeedback onPress={this.props.onPress}>
			<View style={this.props.style}>
				{this.props.children}
			</View>
		</BrokenNativeTouchableWithoutFeedback>
	}

}