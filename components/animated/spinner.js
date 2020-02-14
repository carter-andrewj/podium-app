import React from 'react';
import Component from '../component';
import { Animated, Easing } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';




@inject("store")
@observer
export default class Spinner extends Component {

	static defaultProps = {
		show: true
	}


	constructor() {

		super()

		// State
		this.active = false
		this.isVisible = false

		// Methods
		this.start = this.start.bind(this)
		this.stop = this.stop.bind(this)

		this.setVisible = this.setVisible.bind(this)
		this.show = this.show.bind(this)
		this.hide = this.hide.bind(this)

		this.spinner = new Animated.Value(0.0)
		this.opacity = new Animated.Value(0.0)

	}




// LIFECYCLE

	componentDidMount() {

		// Start spinner
		this.start()

		// Set visible
		this.setVisible()

	}

	componentDidUpdate() {

		// Check if spin should be restarted
		this.start()

		// Check if spinner should fade in/out
		this.setVisible()

	}

	componentWillUnmount() {
		this.stop()
		this.opacity.stopAnimation()
	}




// SPIN

	start() {
		if (!this.active && !this.props.paused) {
			this.active = true
			this.spinner.setValue(0.0)
			Animated
				.timing(this.spinner, {
					toValue: 1.0,
					delay: this.timing.pause,
					duration: this.props.time || this.timing.spin,
					easing: Easing.cubicInOut,
				})
				.start(() => {
					if (this.props.paused || !this.active) {
						this.stop()
					} else {
						this.active = false
						this.start()
					}
				})
			
		}
	}


	stop() {
		if (this.active) {
			this.spinner.stopAnimation()
			this.active = false
		}
	}





// FADE

	setVisible() {
		if (this.isVisible !== this.props.show) {
			if (this.isVisible) {
				this.hide()
			} else {
				this.show()
			}
		}
	}


	show() {

		// Ignore if already showing
		if (this.isVisible) return

		// Set visible flag
		this.isVisible = true

		// Schedule animation, if provided an animator
		if (this.props.animator) {
			this.props.animator.schedule(null, null, [this.opacity, 1.0])

		// otherwise, play the animation
		} else {

			// Calculate timings
			let delay = this.props.delayIn || this.props.delay || 0
			let pause = this.props.pauseIn || this.props.pause || 0

			let speed = this.props.speedIn || this.props.speed || 1.0
			let moveTime = this.timing.move * speed

			let fadeTime = this.timing.fade

			// Animate
			Animated
				.timing(this.opacity, {
					toValue: 1.0,
					duration: fadeTime,
					delay: pause,
					easing: Easing.linear,
				})
				.start()

		}

	}


	hide() {

		// Ignore if already hidden
		if (!this.isVisible) return

		// Clear visible flag
		this.isVisible = false

		// Schedule animation, if provided an animator
		if (this.props.animator) {

			this.props.animator.schedule([this.opacity, 0.0])

		// otherwise, play the animation
		} else {

			// Calculate pause time
			let pause = this.props.pauseOut || this.props.pause || 0
			let delay = this.props.delayOut || this.props.delay || 0

			let speed = this.props.speedOut || this.props.speed || 1.0
			let moveTime = this.timing.move * speed

			let fadeTime = this.timing.fade

			// Animate height
			Animated
				.timing(this.opacity, {
					toValue: 0.0,
					duration: fadeTime,
					delay: delay,
					easing: Easing.linear,
				})
				.start()

		}

	}




// RENDER

	render() {

		const spin = this.spinner.interpolate({
			inputRange: [0.0, 1.0],
			outputRange: ["-30deg", "1050deg"]
		})

		return <Animated.View style={{
				...this.style.container,
				...this.props.containerStyle,
				transform: [{ rotate: spin }],
				opacity: this.opacity
			}}>
			<FontAwesomeIcon
				icon="compass"
				size={this.props.size || 20}
				color={this.props.color ||
					(this.props.style ? this.props.style.color : undefined) ||
					this.colors.white
				}
				style={this.props.style}
			/>
		</Animated.View>
	
	}


}