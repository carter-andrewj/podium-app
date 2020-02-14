import React from 'react';
import Component from '../component';
import { View, Animated, Easing } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import { Map, List } from 'immutable';




@inject("store")
@observer
class SlidingView extends Component {

	static defaultProps = {
		from: "left",
		offset: 0
	}

	constructor() {

		// Initialize
		super({ hide: true })

		// State
		this.isVisible = false
		this.contentWidth = undefined
		this.contentHeight = undefined

		// Methods
		this.setVisible = this.setVisible.bind(this)
		this.resize = this.resize.bind(this)
		this.enter = this.enter.bind(this)
		this.exit = this.exit.bind(this)

		// Animations
		this.open = new Animated.Value(0.0)
		this.height = new Animated.Value(0.0)

		this.position = new Animated.Value(1.0)
		this.displacement = new Animated.Value(0.0)

	}


	get offset() {
		switch (this.props.from) {
			case "right": return this.contentWidth + this.props.offset
			default: return -1 * (this.contentWidth + this.props.offset)
		}
	}



// LIFECYCLE

	componentDidMount() {

		// Set default values
		if (this.props.default === "open") {

			this.isVisible = true

			this.open.setValue(1.0)
			this.height.setValue(this.contentHeight)
			
			this.position.setValue(0.0)
			this.displacement.setValue(this.offset)

		}

		// Set initial visiblity
		this.setVisible(this.props.show)

	}


	componentWillUpdate(nextProps) {

		// Trigger show/hide, if required
		this.setVisible(nextProps.show)

	}


	componentWillUnmount() {
		this.open.stopAnimation()
		this.height.stopAnimation()
		this.position.stopAnimation()
		this.displacement.stopAnimation()
	}




// ANIMATE

	setVisible(visible) {
		if (visible !== this.isVisble) {
			if (visible) {
				this.enter()
			} else {
				this.exit()
			}
		}
	}


	resize({ nativeEvent }) {

		// Get size of content
		this.contentHeight = nativeEvent.layout.height
		this.contentWidth = nativeEvent.layout.width

		// Resize instantly if hidden
		if (this.getState("hide")) {

			// Update animator variables
			this.height.setValue(this.contentHeight)
			this.displacement.setValue(this.offset)

			// Clear hide flag
			this.updateState(state => state.set("hide", false))

		// Otherwise, resize smoothly
		} else {

			// Stop any previous resize
			this.height.stopAnimation()
			this.displacement.stopAnimation()

			// Animate resize
			Animated
				.parallel([
					Animated.timing(this.height, {
						toValue: this.contentHeight,
						duration: this.timing.move,
						easing: Easing.linear
					}),
					Animated.timing(this.displacement, {
						toValue: this.offset,
						duration: this.timing.move,
						easing: Easing.linear
					})
				])
				.start()

		}

	}


	enter() {

		// Ignore if already showing
		if (this.isVisible) return

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
				[this.position, 0.0, this.props.onShow]
			)

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
				.sequence([
					Animated.timing(this.open, {
						toValue: 1.0,
						duration: moveTime,
						delay: delay,
						easing: Easing.linear,
					}),
					Animated.timing(this.position, {
						toValue: 0.0,
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


	exit() {

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
				[this.position, 1.0],
				[this.open, 0.0, this.props.onHide],
				null
			)

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
				.sequence([
					Animated.timing(this.position, {
						toValue: 1.0,
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
		let paddingTop = 0
		let paddingBottom = 0
		let borderWidth = 0
		if (this.props.style) {
			marginTop = (this.props.style.marginTop || this.props.style.marginTop === 0) ?
				this.props.style.marginTop
				: this.props.style.margin || 0
			marginBottom = (this.props.style.marginBottom || this.props.style.marginBottom === 0) ?
				this.props.style.marginBottom
				: this.props.style.margin || 0
			paddingTop = (this.props.style.paddingTop || this.props.style.paddingTop === 0) ?
				this.props.style.paddingTop
				: this.props.style.padding || 0
			paddingBottom = (this.props.style.paddingBottom || this.props.style.paddingBottom === 0) ?
				this.props.style.paddingBottom
				: this.props.style.padding || 0
			borderWidth = this.props.style.borderWidth || 0
		}

		return <Animated.View
			key={this.props.key}
			pointerEvents={this.isVisible ? "box-none" : "none"}
			style={{
				...this.style.container,
				...this.props.style,
				marginTop: Animated.multiply(marginTop, this.open),
				marginBottom: Animated.multiply(marginBottom, this.open),
				paddingTop: Animated.multiply(paddingTop, this.open),
				paddingBottom: Animated.multiply(paddingBottom, this.open),
				borderWidth: Animated.multiply(borderWidth, this.open),
				minHeight: Animated.multiply(this.height, this.open),
				maxHeight: Animated.multiply(this.height, this.open),
				transform: [{ translateX: Animated.multiply(this.displacement, this.position) }],
				opacity: this.getState("hide") ? 0.0 : 1.0
			}}>

			<View
				pointerEvents="none"
				style={{
					...this.style.container,
					position: "absolute",
					opacity: 0.0
				}}>
				<View
					onLayout={this.resize}
					style={{
						...this.style.container,
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


export default SlidingView;