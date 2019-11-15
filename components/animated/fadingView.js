import React from 'react';
import Component from '../component';
import { View, Animated, Easing } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import { Map, List } from 'immutable';

import styles from '../../styles/styles';
import settings from '../../settings';




class FadingView extends Component {

	constructor() {

		super()

		// State
		this.isVisible = false
		this.contentHeight = undefined

		// Methods
		this.setVisible = this.setVisible.bind(this)
		this.resize = this.resize.bind(this)
		this.show = this.show.bind(this)
		this.hide = this.hide.bind(this)

		// Animations
		this.height = new Animated.Value(0.0)
		this.open = new Animated.Value(0.0)
		this.opacity = new Animated.Value(0.0)

	}




// LIFECYCLE

	componentDidMount() {

		// Set default values
		if (this.props.default === "open") {
			this.isVisible = true
			this.height.setValue(this.contentHeight)
			this.open.setValue(1.0)
			this.opacity.setValue(1.0)
		}

		// Trigger show/hide, if required
		this.setVisible(this.props.show)

	}


	componentWillUpdate(nextProps) {

		// Trigger show/hide, if required
		this.setVisible(nextProps.show)

	}


	componentWillUnmount() {
		this.open.stopAnimation()
		this.height.stopAnimation()
		this.opacity.stopAnimation()
	}




// ANIMATE

	setVisible(visible) {
		if (visible !== this.isVisble) {
			if (visible) {
				this.show()
			} else {
				this.hide()
			}
		}
	}


	resize({ nativeEvent }) {

		// Get size of content
		this.contentHeight = nativeEvent.layout.height

		// Get timings
		let duration = settings.layout.moveTime

		// Animate resize
		Animated
			.timing(this.height, {
				toValue: this.contentHeight,
				duration: duration,
				easing: Easing.linear
			})
			.start()

	}


	show() {

		// Ignore if already showing
		if (this.isVisible || this.props.suppressShow) return

		// Run callback
		if (this.props.beforeShow) this.props.beforeShow()

		// Set visible flag
		this.isVisible = true

		// Schedule animation, if provided an animator
		if (this.props.animator) {

			// Schedule
			this.props.animator.schedule(
				null,
				[this.open, 1.0],
				[this.opacity, 1.0, this.props.onShow]
			)

		// otherwise, play the animation
		} else {

			// Calculate timings
			let delay = this.props.delayIn || this.props.delay || 0
			let pause = this.props.pauseIn || this.props.pause || 0

			let speed = this.props.speedIn || this.props.speed || 1.0
			let moveTime = settings.layout.moveTime * speed

			let fadeTime = settings.layout.fadeTime

			// Animate
			Animated
				.sequence([
					Animated.timing(this.open, {
						toValue: 1.0,
						duration: moveTime,
						delay: delay,
						easing: Easing.linear,
					}),
					Animated.timing(this.opacity, {
						toValue: 1.0,
						duration: fadeTime,
						delay: pause,
						easing: Easing.linear,
					})
				])
				.start(({ finished }) => (finished && this.props.onShow) ?
					this.props.onShow()
					: null
				)

		}

	}


	hide() {

		// Ignore if already hidden
		if (!this.isVisible || this.props.suppressHide) return

		// Run callback
		if (this.props.beforeHide) this.props.beforeHide()

		// Clear visible flag
		this.isVisible = false

		// Schedule animation, if provided an animator
		if (this.props.animator) {

			// Schedule
			this.props.animator.schedule(
				[this.opacity, 0.0],
				[this.open, 0.0, this.props.onHide],
				null
			)

		// otherwise, play the animation
		} else {

			// Calculate pause time
			let pause = this.props.pauseOut || this.props.pause || 0
			let delay = this.props.delayOut || this.props.delay || 0

			let speed = this.props.speedOut || this.props.speed || 1.0
			let moveTime = settings.layout.moveTime * speed

			let fadeTime = settings.layout.fadeTime

			// Animate height
			Animated
				.sequence([
					Animated.timing(this.opacity, {
						toValue: 0.0,
						duration: fadeTime,
						delay: delay,
						easing: Easing.linear,
					}),
					Animated.timing(this.open, {
						toValue: 0.0,
						duration: moveTime,
						delay: pause,
						easing: Easing.linear,
					})
				])
				.start(({ finished }) => (finished && this.props.onHide) ?
					this.props.onHide()
					: null
				)

		}

	}



	render() {

		let marginTop = 0
		let marginBottom = 0
		if (this.props.style) {
			marginTop = this.props.style.marginTop || this.props.style.margin || 0
			marginBottom = this.props.style.marginBottom || this.props.style.margin || 0
		}

		return <Animated.View
			pointerEvents={this.isVisible ? "box-none" : "none"}
			style={{
				...styles.container,
				...this.props.style,
				marginTop: Animated.multiply(marginTop, this.open),
				marginBottom: Animated.multiply(marginBottom, this.open),
				minHeight: Animated.multiply(this.height, this.open),
				maxHeight: Animated.multiply(this.height, this.open),
				opacity: this.opacity
			}}>

			<View
				pointerEvents="none"
				style={{
					...styles.container,
					position: "absolute",
					opacity: 0.0
				}}>
				<View
					onLayout={this.resize}
					style={{
						...styles.container,
						...this.props.style,
						backgroundColor: null,
						width: "auto"
					}}>
					{this.props.children}
				</View>
			</View>

			{this.props.children}

		</Animated.View>
	}

}


export default FadingView;