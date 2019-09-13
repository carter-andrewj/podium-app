import React from 'react';
import Component from '../utils/component';
import { Keyboard, Dimensions, Animated, Easing,
		 NativeModules, StatusBarIOS, View } from 'react-native';

import styles from '../styles/styles';
import settings from '../settings';




export default class KeyboardView extends Component {

	constructor() {

		super()

		this.state = {
			screen: Dimensions.get("window").height,
			keyboard: 0,
			statusBar: 0
		}

		this.statusBarListener = null
		this.keyboardShow = null
		this.keyboardHide = null

		this.keyboardEnter = this.keyboardEnter.bind(this)
		this.keyboardExit = this.keyboardExit.bind(this)
		this.setKeyboardHeight = this.setKeyboardHeight.bind(this)

	}


	componentWillMount() {
		
		// Get height of status bar
		NativeModules.StatusBarManager
			.getHeight(({ height }) => this.updateState(
				state => state.set("statusBar", height)
			))

		// Listen for changes in status bar height
		this.statusBarListener = StatusBarIOS.addListener(
			"statusBarFrameWillChange",
			({ frame }) => this.updateState(
				state => state.set("statusBar", frame.height)
			)
		)

    	// Listen for keyboard events
    	this.keyboardShow = Keyboard.addListener(
			"keyboardDidShow",
			this.keyboardEnter
		)
		this.keyboardHide = Keyboard.addListener(
			"keyboardDidHide",
			this.keyboardExit
		)

	}


	keyboardEnter(event) {
		this.setKeyboardHeight(event.endCoordinates.height)
	}

	keyboardExit(event) {
		this.setKeyboardHeight(0)
	}


	setKeyboardHeight(height) {
		this.updateState(
			state => state.set("keyboard", height),
			this.props.onChange ?
				() => this.props.onChange(height)
				: null
		)
	}


	render() {
		const height = this.state.screen - (this.props.offset || 0)
		const padding = this.state.keyboard + this.state.statusBar
		return <View style={[
				styles.container,
				{
					minHeight: height,
					maxHeight: height,
					paddingBottom: padding
				},
				this.props.style
			]}>
			{this.props.children}
		</View>
	}

	componentWillUnmount() {
		this.statusBarListener.remove()
		this.keyboardShow.remove()
		this.keyboardHide.remove()
	}

}