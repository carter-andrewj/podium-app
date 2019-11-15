import React from 'react';
import Component from './component';
import Constants from 'expo-constants';
import { Animated, Keyboard, Dimensions, Easing, View} from 'react-native';

import styles from '../styles/styles';
import settings from '../settings';




export default class KeyboardView extends Component {

	constructor() {

		super()

		// Listeners
		this.statusBarListener = null
		this.keyboardShow = null
		this.keyboardHide = null

		// Methods
		this.rescale = this.rescale.bind(this)
		this.setOffset = this.setOffset.bind(this)

		// Animation
		this.keyboardOpen = false
		this.offset = 0
		this.statusBar = Constants.statusBarHeight
		this.screen = Dimensions.get("window").height - this.statusBar
		this.padding = new Animated.Value(0.0)

	}


	rescale(end, time) {
		Animated
			.timing(this.padding, {
				toValue: end,
				delay: settings.layout.keyboardDelay,
				duration: time - settings.layout.keyboardDelay,
				easing: Easing.bezier(0.17, 0.59, 0.4, 0.77)
			})
			.start()
	}


	setOffset(initial = false) {

		// Calculate screen padding
		if (this.props.offsetBottom) {

			if (this.props.offsetBottom >= 1) {

				// Calculate specified offset value
				this.offset = this.props.offsetBottom

			} else {

				// Calculate relative offset value
				this.offset = this.props.offsetBottom * this.screen

			}

		} else {

			this.offset = 0

		}

		// If keyboard is closed, resize
		if (!this.keyboardOpen) {
			this.rescale(this.offset, initial ? 0 : settings.layout.moveTime)
		}

	}


// LIFECYCLE

	componentWillMount() {

		// Calculate initial offset
		this.setOffset(true)

    	// Listen for keyboard events
    	this.keyboardShow = Keyboard.addListener(
			"keyboardWillShow",
			({ duration, endCoordinates }) => {
				this.keyboardOpen = true
				this.rescale(endCoordinates.height - this.statusBar, duration)
			}
		)

		this.keyboardHide = Keyboard.addListener(
			"keyboardWillHide",
			({ duration }) => {
				this.keyboardOpen = false
				this.rescale(this.offset, duration)
			}
		)

	}

	componentDidUpdate(lastProps) {

		// Check if offset changed
		if (lastProps.offsetBottom !== this.props.offsetBottom) {
			this.setOffset()
		}

	}





	render() {
		return <View style={{
				...styles.screen,
				maxHeight: this.screen
			}}>
			<Animated.View
				style={{
					...styles.container,
					...this.props.style,
					overflow: "hidden",
					paddingTop: this.props.offsetTop,
					paddingBottom: this.padding
				}}>
				<View style={styles.container}>
					{this.props.children}
				</View>
			</Animated.View>
		</View>
	}

	componentWillUnmount() {
		this.keyboardShow.remove()
		this.keyboardHide.remove()
	}

}