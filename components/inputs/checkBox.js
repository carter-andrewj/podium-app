import React from 'react';
import Component from '../component';
import { Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import TouchableWithoutFeedback from './touchableWithoutFeedback';




@inject("store")
@observer
export default class CheckBox extends Component {

	constructor() {
		super({ on: false })
		this.set = this.set.bind(this)
		this.toggle = this.toggle.bind(this)
	}

	componentWillMount() {
		this.set(this.props.value)
	}

	componentDidUpdate(lastProps) {
		if (lastProps.value !== this.props.value) {
			this.set(this.props.value)
		}
	}

	set(x) {
		this.updateState(state => state.set("on", x))
	}

	toggle() {
		this.updateState(
			state => state.update("on", x => !x),
			this.props.onChange ?
				() => this.props.onChange(this.getState("on"))
				: null
		)
	}

	render() {
		return <TouchableWithoutFeedback onPress={this.toggle}>
			<View style={{
					...this.style.checkbox.container,
					...this.props.style
				}}>
				<FontAwesomeIcon
					icon="check"
					size={this.layout.checkbox.icon}
					color={this.getState("on") ?
						this.props.color || this.colors.black
						: "transparent"
					}
					style={{
						...this.style.checkbox.check,
						...this.props.iconStyle
					}}
				/>
			</View>
		</TouchableWithoutFeedback>
	}

}