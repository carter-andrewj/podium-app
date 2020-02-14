import React from 'react';
import Component from './component';
import Constants from 'expo-constants';
import { inject, observer } from 'mobx-react';
import { Animated, Keyboard, Dimensions, Easing, View} from 'react-native';




@inject("store")
@observer
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
		this.padding = new Animated.Value(0.0)

	}


	rescale(end, time) {
		Animated
			.timing(this.padding, {
				toValue: end,
				delay: this.timing.keyboardDelay,
				duration: time - this.timing.keyboardDelay,
				easing: Easing.bezier(0.17, 0.59, 0.4, 0.77)
			})
			.start(({ finished }) => {
				if (finished) {
					let height = this.props.store.style.layout.screen.height - end
					this.props.store.style.setVisibleHeight(height)
				}
			})
	}


	setOffset(initial = false) {

		// Calculate screen padding
		if (this.props.offsetBottom) {

			if (this.props.offsetBottom >= 1) {

				// Calculate specified offset value
				this.offset = this.props.offsetBottom

			} else {

				// Calculate relative offset value
				this.offset = this.props.offsetBottom * this.layout.screen.height

			}

		} else {

			this.offset = 0

		}

		// If keyboard is closed, resize
		if (!this.keyboardOpen) {
			this.rescale(this.offset, initial ? 0 : this.timing.move)
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
				this.rescale(endCoordinates.height - this.layout.screen.statusBar, duration)
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


	componentWillUnmount() {
		this.keyboardShow.remove()
		this.keyboardHide.remove()
	}



// RENDER

	render() {
		return <View style={{
				...this.style.general.screen,
				maxHeight: this.layout.screen.height
			}}>
			<Animated.View
				style={{
					...this.style.general.container,
					...this.props.style,
					overflow: "hidden",
					paddingTop: this.props.offsetTop,
					paddingBottom: this.padding
				}}>
				<View style={this.style.general.container}>
					{this.props.children}
				</View>
				<View style={{
						...this.style.general.container,
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
					}}>
					{this.props.footer}
				</View>
			</Animated.View>
		</View>
	}

}